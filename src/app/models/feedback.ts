export interface Feedback {
  id: string;
  given_by: string;
  given_to: string;
  text: string;
  rating: number;
  created_at: string;
}

export interface FeedbackRequest {
  order_id: string | null;
  feedback_text: string;
  rating: number | null;
}
