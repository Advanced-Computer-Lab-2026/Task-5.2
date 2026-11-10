import { sanitizeHtml } from '../lib/sanitize'

// Renders a list of reviews. Each review body is HTML (reviewers can use light
// formatting), so it is injected with dangerouslySetInnerHTML after passing
// through sanitizeHtml — the one seam responsible for keeping it safe.
export default function ReviewList({ reviews }) {
  if (!reviews || reviews.length === 0) {
    return <div className="text-sm text-zinc-600">No reviews yet.</div>
  }

  return (
    <div className="space-y-3">
      {reviews.map(r => (
        <div key={r._id} className="card">
          <div className="text-sm text-zinc-600">
            {'★'.repeat(r.rating || 0)}{'☆'.repeat(5 - (r.rating || 0))}
            {' • '}by {r.author?.name || 'unknown'}
          </div>
          
          <div
            className="review-body mt-2 text-sm"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(r.body) }}
          />
        </div>
      ))}
    </div>
  )
}
