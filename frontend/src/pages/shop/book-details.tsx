import { useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCreateReviewsMutation, useGetBookDetailsQuery } from "@/redux/API/book-api-slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Plus, Minus, ShoppingCart, ChevronDown, ChevronUp, Star } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
// @ts-expect-error  // swiper
import "swiper/css";
// @ts-expect-error //navigation
import "swiper/css/navigation";
// @ts-expect-error // pagination
import "swiper/css/pagination";
import FavouriteButton from "@/components/favourite-button";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/features/cart/cart-slice";
import { toast } from "sonner";
import type { RootState } from "@/redux/features/store";
import ReviewsSection from "@/components/reviews-section";
const BookDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: book, isLoading, refetch, error } = useGetBookDetailsQuery(id ?? "");
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { userInfo } = useSelector((state: RootState) => state.auth)
  const [comment, setComment] = useState("")
  const [rating, setRating] = useState("")
  const [createReviews] = useCreateReviewsMutation()
  const addReviews = async (e) => {
    e.preventDefault()
    try{
      await createReviews({
        bookId: id,
        rating,
        comment,
      }).unwrap()
      refetch()
      toast.success("Add review successfully")
    }
    catch (err: unknown) {
      if (typeof err === "object" && err !== null && "data" in err) {
        const errorData = (err as { data?: { message?: string } }).data;
        toast.error(errorData?.message || "Failed to add review");
      } else {
        toast.error("Failed to add review");
      }
    }
  }
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  if (error || !book) {
    return (
      <div className="flex justify-center items-center min-h-screen pt-20">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Something went wrong.</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }
  const adjustQuantity = (action: 'increase' | 'decrease') => {
    setQuantity((prev) => {
      if (action === 'decrease') {
        return prev > 1 ? prev - 1 : prev;
      }
      if (action === 'increase') {
        return prev < book.stock ? prev + 1 : prev;
      }
      return prev;
    });
  };
  const calculateAverageRating = () => {
    if (!book.reviews || book.reviews.length === 0) return 0;
    const total = book.reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / book.reviews.length).toFixed(1);
  };
  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    book.reviews?.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };
  const addToCartHandler = () => {
    dispatch(addToCart({...book, userId: userInfo?._id,  quantity}))
    toast.success("Đã thêm vào giỏ hàng");
  }
  const buyNowHandler = () => {
    dispatch(addToCart({ ...book, userId: userInfo?._id, quantity }));
    navigate("/cart");
  };
  return (
   <div className="pt-20 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8">
        
        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-8">
          {/* Left - Images */}
          <div className="space-y-6">
            {/* Main Image Carousel */}
            <div className="w-full max-w-[500px] mx-auto">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                navigation
                pagination={{ clickable: true }}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                }}
                loop={true}
                className="aspect-[3/4] rounded-xl overflow-hidden bg-white border shadow-lg"
              >
                {book?.images?.map((img: { url: string }, index: number) => (
                  <SwiperSlide key={index}>
                    <div className="w-full h-full flex items-center justify-center p-6">
                      <img
                        src={img.url}
                        alt={`${book.name} - Image ${index + 1}`}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Features Card */}
            <Card className="max-w-[500px] mx-auto shadow-md">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-lg">🚚</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Fast Delivery</p>
                    <p className="text-gray-600">Quick and reliable shipping</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-lg">🔄</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Easy Returns</p>
                    <p className="text-gray-600">Free returns nationwide</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 text-lg">💰</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Bulk Discounts</p>
                    <p className="text-gray-600">Special prices for large orders</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right - Product Info */}
          <div className="space-y-6">
            {/* Product Header */}
            <div className="space-y-4">
              <div className="flex justify-between items-start gap-4">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                  {book.name.trim()}
                </h1>
                <FavouriteButton book={book} />
              </div>

              {/* Rating Summary */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= Math.round(Number(calculateAverageRating()))
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-medium text-gray-900">
                    {calculateAverageRating()}
                  </span>
                  <span className="text-gray-500">
                    ({book.reviews?.length || 0} reviews)
                  </span>
                </div>
              </div>

              {/* Author & Publisher Info */}
              <div className="space-y-2">
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium text-gray-900">Author:</span>{' '}
                    <span>{book.author}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Publisher:</span>{' '}
                    <span>{book.publishingHouse}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium text-gray-900">Year:</span>{' '}
                    <span>{book.publishYear}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Sold:</span>{' '}
                    <span>{book.salesCount} copies</span>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-red-600">
                  ${book.price.toLocaleString()}
                </span>
                {book.stock > 0 ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    In Stock
                  </Badge>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
              </div>
            </div>

            {/* Quantity Selector */}
            <Card className="p-4">
              <div className="space-y-4">
                <Label className="text-base font-medium">Quantity:</Label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => adjustQuantity('decrease')}
                      disabled={quantity <= 1}
                      className="h-10 w-10 p-0 hover:bg-gray-100"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        const value = Math.max(1, Math.min(book.stock, parseInt(e.target.value) || 1));
                        setQuantity(value);
                      }}
                      className="w-20 text-center border-0 border-x border-gray-300 rounded-none focus-visible:ring-0"
                      min={1}
                      max={book.stock}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => adjustQuantity('increase')}
                      disabled={quantity >= book.stock}
                      className="h-10 w-10 p-0 hover:bg-gray-100"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <span className="text-sm text-gray-500">
                    ({book.stock} available)
                  </span>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                className="flex-1 h-12 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 transition-all duration-200"
                onClick={addToCartHandler}
                disabled={book.stock === 0}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              <Button 
                onClick={buyNowHandler} 
                className="flex-1 h-12 bg-red-600 hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                disabled={book.stock === 0}
              >
                Buy Now
              </Button>
            </div>

            {/* Product Details Table */}
            <Card className="border-gray-200 shadow-sm">
              <CardContent className="p-0">
                <div className="overflow-hidden">
                   <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium w-1/3">Product code</TableCell>
                      <TableCell>{book._id}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Publisher</TableCell>
                      <TableCell>{book.publishingHouse}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Publish Year</TableCell>
                      <TableCell>{book.publishYear}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Language</TableCell>
                      <TableCell>{book.language}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Quantity of Page</TableCell>
                      <TableCell>{book.pageNumber}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                </div>
              </CardContent>
            </Card>
             <Card className="mb-8 shadow-lg border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center justify-between">
              Book Description
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="text-gray-500 hover:text-gray-700"
              >
                {isDescriptionExpanded ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className={`prose max-w-none transition-all duration-300 ${
              isDescriptionExpanded ? '' : 'line-clamp-3'
            }`}>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {book.description}
              </p>
            </div>
            {book.description && book.description.length > 200 && (
              <Button
                variant="link"
                className="p-0 h-auto mt-2 text-blue-600 hover:text-blue-800"
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              >
                {isDescriptionExpanded ? 'Show Less' : 'Read More'}
              </Button>
            )}
          </CardContent>
        </Card>
          </div>
        </div>
        {/* Enhanced Reviews Section */}
        <Card className="shadow-lg border-gray-200">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Customer Reviews
              </CardTitle>
              {book.reviews && book.reviews.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= Math.round(Number(calculateAverageRating()))
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-lg">{calculateAverageRating()}</span>
                  <span className="text-gray-500">({book.reviews.length} reviews)</span>
                </div>
              )}
            </div>

            {/* Rating Distribution */}
            {book.reviews && book.reviews.length > 0 && (
              <div className="mt-6 space-y-2">
                {Object.entries(getRatingDistribution()).reverse().map(([rating, count]) => (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-16">
                      <span className="text-sm font-medium">{rating}</span>
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    </div>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 transition-all duration-300"
                        style={{
                          width: `${book.reviews.length > 0 ? (count / book.reviews.length) * 100 : 0}%`
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 w-8">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </CardHeader>
          <CardContent>
            <ReviewsSection
              loadingProductReviews={isLoading}
              userInfo={userInfo}
              submitHandler={addReviews}
              rating={rating}
              setRating={setRating}
              comment={comment}
              setComment={setComment}
              book={book}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookDetails;