import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../hooks/useAuth'
import ReviewList from '../components/ReviewList'
import { sanitizeHtml } from '../lib/sanitize'
export default function ListingReviews() {
  const { id } = useParams()
  const { user } = useAuth()

  const [listing, setListing] = useState(null)
  const [reviews, setReviews] = useState([])
  const [body, setBody] = useState('')
  const [rating, setRating] = useState(5)
  const [error, setError] = useState('')

  async function load() {
    setError('')
    try {
      const [listingRes, reviewsRes] = await Promise.all([
        api.get(`/listings/${id}`),
        api.get('/reviews', { params: { listing: id } })
      ])
      setListing(listingRes.data.listing)
      setReviews(reviewsRes.data.reviews)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load reviews')
    }
  }

  useEffect(() => { load() }, [id])

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const safeBody = sanitizeHtml(body)

      await api.post('/reviews', {
        listing: id,
        body: safeBody,
        rating: Number(rating)
      })
      setBody('')
      setRating(5)
      load()
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to post review')
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Link to="/listings" className="text-sm">← Back to listings</Link>
        <h1 className="text-xl font-semibold mt-2">
          Reviews{listing ? ` for ${listing.title}` : ''}
        </h1>
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      {user ? (
        <form onSubmit={onSubmit} className="card space-y-3">
          <div>
            <label className="block mb-1">Rating</label>
            <select
              value={rating}
              onChange={e => setRating(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              {[5, 4, 3, 2, 1].map(n => (
                <option key={n} value={n}>{n} star{n === 1 ? '' : 's'}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1">Your review</label>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Great seller — shipped fast. You can use <b>bold</b> and links."
              rows="4"
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <button className="btn" type="submit">Post review</button>
        </form>
      ) : (
        <div className="text-sm text-zinc-600">
          <Link to="/login" className="underline">Log in</Link> to write a review.
        </div>
      )}

      <ReviewList reviews={reviews} />
    </div>
  )
}
