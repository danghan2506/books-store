import { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetBookDetailsQuery } from "@/redux/API/book-api-slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Plus, Minus, ShoppingCart, Heart } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Favourite from "./favourites";
import FavouriteButton from "@/components/favourite-button";

const BookDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: book, isLoading, error } = useGetBookDetailsQuery(id);
  const [quantity, setQuantity] = useState<number>(1);

  if (isLoading) return <div className="flex justify-center items-center min-h-screen pt-20">Loading book...</div>;
  if (error || !book) return <div className="flex justify-center items-center min-h-screen pt-20">Something went wrong.</div>;

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, Math.min(book.stock, prev + delta)));
  };
  return (
    <div className="pt-20 bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-[1400px] px-4 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left - Images */}
          <div className="space-y-4 rounded-2xl ">
            {/* Main Image Carousel */}
            <div className="w-full max-w-[400px] mx-auto">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                navigation
                pagination={{ clickable: true }}
                autoplay={{
                  delay: 3500,
                  disableOnInteraction: false,
                }}
                loop={true}
                className="aspect-[3/4] rounded-lg overflow-hidden bg-white border shadow-sm"
              >
                {book.images.map((img, index) => (
                  <SwiperSlide key={index}>
                    <div className="w-full h-full flex items-center justify-center p-4">
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

            {/* Thumbnail Images */}
            {/* <div className="flex gap-2 justify-center overflow-x-auto pb-2 max-w-[400px] mx-auto">
              {book.images.map((img, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-16 h-20 border-2 border-gray-200 rounded-md overflow-hidden bg-white hover:border-gray-300 transition-colors"
                >
                  <img
                    src={img.url}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-contain p-1"
                  />
                </div>
              ))}
              {book.images.length > 4 && (
                <div className="flex-shrink-0 w-16 h-20 border-2 border-gray-200 rounded-md bg-gray-100 flex items-center justify-center text-gray-500 text-sm font-medium">
                  +{book.images.length - 4}
                </div>
              )}
            </div> */}

            {/* Extra Info Card */}
            <Card className="max-w-[400px] mx-auto">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">🚚 Thời gian giao hàng:</span>
                  <span>Giao nhanh và uy tín</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">🔄 Chính sách đổi trả:</span>
                  <span>Đổi trả miễn phí toàn quốc</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">👥 Chính sách khách sỉ:</span>
                  <span>Ưu đãi khi mua số lượng lớn</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right - Product Info */}
          <div className="space-y-6">
            {/* Product Header */}
            <div className="space-y-3">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{book.name.trim()}</h1>
              <span className="flex items-center justify-end">
  <FavouriteButton book={book}/>
</span>
              <div className="space-y-1 text-sm text-gray-600">
                <p><span className="font-medium">Tác giả:</span> {book.author}</p>
                <p><span className="font-medium">Nhà xuất bản:</span> {book.publishingHouse}</p>
                <p><span className="font-medium">Năm xuất bản:</span> {book.publishYear}</p>
                <p><span className="font-medium">Đã bán:</span> {book.salesCount}</p>
              </div>
              <div className="text-2xl font-bold text-red-600">
                {book.price.toLocaleString()}₫
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Số lượng:</Label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-300 rounded-md">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="h-10 w-10 p-0"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(book.stock, Number(e.target.value))))}
                    className="w-16 text-center border-0 border-x border-gray-300 rounded-none focus-visible:ring-0"
                    min={1}
                    max={book.stock}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= book.stock}
                    className="h-10 w-10 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm text-gray-500">
                  ({book.stock} sản phẩm có sẵn)
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1 h-11 border-red-300 text-red-600 hover:bg-red-50"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to cart
              </Button>
              <Button className="flex-1 h-11 bg-red-600 hover:bg-red-700">
                Buy now
              </Button>
            </div>

            {/* Product Details Table */}
            <Card>
              <CardContent className="p-0">
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
                    <TableRow>
                      <TableCell className="font-medium">Book's Description</TableCell>
                      <TableCell className="whitespace-pre-line">{book.description}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;