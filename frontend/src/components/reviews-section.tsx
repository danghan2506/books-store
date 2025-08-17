import { useState, useMemo, useCallback } from 'react';
import { MessageSquare, Users, Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import type { UserInterface } from '@/types/user-type';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { Book, Review } from '@/types/books-type';
import { Link } from 'react-router-dom';
interface ProductRatingStats {
  averageRating: number;
  totalReviews: number;
  distribution: Record<number, number>;
}
interface ReviewProps {
  loadingProductReviews: boolean;
  userInfo: UserInterface;
  submitHandler: (e: React.FormEvent<HTMLFormElement>) => void;
  rating: string;
  setRating: (rating: string) => void;
  comment: string;
  setComment: (comment: string) => void;
  book: Book;
  onReviewSubmitSuccess?: () => void;
  showSuccessMessage?: boolean;
}

// Rating Stars Component
const RatingStars = ({ rating, size = 'w-4 h-4' }: { rating: number; size?: string }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${size} ${
            star <= rating
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

// Rating Summary Component
const RatingSummary = ({ stats }: { stats: ProductRatingStats }) => {
  const { averageRating, totalReviews, distribution } = stats;

  return (
    <Card className="border-gray-200 shadow-sm h-fit">
      <CardHeader className="pb-4">
        <h3 className="text-lg font-semibold text-gray-900">Customer Reviews</h3>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Average Rating Display */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-3xl font-bold text-gray-900">
              {averageRating.toFixed(1)}
            </span>
            <div className="flex flex-col">
              <RatingStars rating={Math.round(averageRating)} size="w-5 h-5" />
              <span className="text-sm text-gray-500 mt-1">out of 5</span>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
          </p>
        </div>

        <Separator />

        {/* Rating Distribution */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Rating breakdown</h4>
          {[5, 4, 3, 2, 1].map((star) => {
            const count = distribution[star] || 0;
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            
            return (
              <div key={star} className="flex items-center gap-3">
                <div className="flex items-center gap-1 min-w-[60px]">
                  <span className="text-sm font-medium">{star}</span>
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                </div>
                <div className="flex-1">
                  <Progress 
                    value={percentage} 
                    className="h-2 bg-gray-200"
                  />
                </div>
                <span className="text-sm text-gray-600 min-w-[40px] text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

const ReviewsSection = ({
  loadingProductReviews,
  userInfo,
  submitHandler,
  rating,
  setRating,
  comment,
  setComment,
  book,
  onReviewSubmitSuccess,
  showSuccessMessage = false
}: ReviewProps) => {
  const [activeTab, setActiveTab] = useState(1);
  const [visibleReviews, setVisibleReviews] = useState(5);
  const [sortBy, setSortBy] = useState('newest');

  // Calculate rating statistics
  const ratingStats = useMemo((): ProductRatingStats => {
    if (!book.reviews || book.reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }

    const totalReviews = book.reviews.length;
    const totalRating = book.reviews.reduce((sum: number, review: Review) => sum + review.rating, 0);
    const averageRating = totalRating / totalReviews;

    const distribution = book.reviews.reduce((acc: Record<number, number>, review: Review) => {
      acc[review.rating] = (acc[review.rating] || 0) + 1;
      return acc;
    }, { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });

    return {
      averageRating,
      totalReviews,
      distribution
    };
  }, [book.reviews]);

  const sortedReviews = useMemo(() => {
    return book.reviews ? [...book.reviews].sort((a: Review, b: Review) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt ?? '').getTime() - new Date(a.createdAt ?? '').getTime();
        case 'oldest':
          return new Date(a.createdAt ?? '').getTime() - new Date(b.createdAt ?? '').getTime();
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        default:
          return 0;
      }
    }) : [];
  }, [book.reviews, sortBy]);

  const handleFormSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await submitHandler(e);
      // Clear form on success
      setRating('');
      setComment('');
      onReviewSubmitSuccess?.();
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  }, [submitHandler, setRating, setComment, onReviewSubmitSuccess]);

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return date.toLocaleDateString();
  }, []);

  const getInitials = useCallback((name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, []);

  const tabs = [
    { id: 1, label: 'Write Review', icon: MessageSquare },
    { id: 2, label: 'All Reviews', icon: Users },
  ];

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
                {tab.id === 2 && book.reviews && (
                  <Badge variant="secondary" className="ml-2">
                    {book.reviews.length}
                  </Badge>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {/* Write Review Tab */}
        {activeTab === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Write Review Form - 2 columns on desktop */}
            <div className="lg:col-span-2">
              {showSuccessMessage && (
                <Alert className="mb-6 border-green-200 bg-green-50">
                  <AlertDescription className="text-green-700">
                    Your review has been submitted successfully!
                  </AlertDescription>
                </Alert>
              )}

              {userInfo ? (
                <Card className="border-gray-200 shadow-sm">
                  <CardContent className="p-6">
                    <form onSubmit={handleFormSubmit} className="space-y-6">
                      <div>
                        <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-3">
                          Your Rating
                        </label>
                        <select
                          id="rating"
                          required
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="">Select a rating</option>
                          <option value="1">⭐ Poor</option>
                          <option value="2">⭐⭐ Fair</option>
                          <option value="3">⭐⭐⭐ Good</option>
                          <option value="4">⭐⭐⭐⭐ Very Good</option>
                          <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-3">
                          Your Review
                        </label>
                        <textarea
                          id="comment"
                          rows={5}
                          required
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Share your thoughts about this book. What did you like or dislike?"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                          maxLength={500}
                        />
                        <p className={`text-sm mt-2 ${
                          comment.length > 450 ? 'text-red-500' : 'text-gray-500'
                        }`}>
                          {comment.length}/500 characters
                        </p>
                      </div>

                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          disabled={loadingProductReviews}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                          {loadingProductReviews ? (
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Submitting...
                            </div>
                          ) : (
                            'Submit Review'
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-gray-200 shadow-sm">
                  <CardContent className="text-center py-12">
                    <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Sign in to write a review
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Share your experience with other readers
                    </p>
                    <Link
                      to="/login"
                      className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                    >
                      Sign In
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
            
            {/* Rating Summary - 1 column on desktop */}
            <div className="lg:col-span-1">
              <RatingSummary stats={ratingStats} />
            </div>
          </div>
        )}

        {/* All Reviews Tab */}
        {activeTab === 2 && (
          <div className="space-y-6">
            {book.reviews && book.reviews.length === 0 ? (
              <Card className="border-gray-200 shadow-sm">
                <CardContent className="text-center py-16">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No reviews yet
                  </h3>
                  <p className="text-gray-600">
                    Be the first to share your thoughts about this book!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Sort Options */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {book.reviews?.length} Reviews
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="highest">Highest Rating</option>
                      <option value="lowest">Lowest Rating</option>
                    </select>
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  {sortedReviews.slice(0, visibleReviews).map((review: Review) => (
                    <Card key={review._id} className="border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Avatar className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0">
                            <AvatarFallback className="bg-transparent text-white font-medium">
                              {getInitials(review.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                              <div>
                                <h4 className="font-medium text-gray-900 truncate">{review.name}</h4>
                                <p className="text-sm text-gray-500">
                                  {formatDate(review.createdAt ?? "")}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <RatingStars rating={review.rating} />
                                <Badge 
                                  variant={review.rating >= 4 ? "default" : review.rating >= 3 ? "secondary" : "destructive"}
                                  className="ml-2"
                                >
                                  {review.rating}/5
                                </Badge>
                              </div>
                            </div>
                            
                            <p className="text-gray-700 leading-relaxed mb-4">
                              {review.comment}
                            </p>

                            <Separator className="my-4" />
                            
                            <div className="flex items-center gap-4">
                              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                                <ThumbsUp className="w-4 h-4 mr-1" />
                                <span className="hidden sm:inline">Helpful</span>
                              </Button>
                              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                                <ThumbsDown className="w-4 h-4 mr-1" />
                                <span className="hidden sm:inline">Not Helpful</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Load More Button */}
                {book.reviews && visibleReviews < book.reviews.length && (
                  <div className="text-center">
                    <Button
                      variant="outline"
                      onClick={() => setVisibleReviews(prev => prev + 5)}
                      className="px-8 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Show More Reviews ({book.reviews.length - visibleReviews} remaining)
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsSection;