# Book Store Fixes

## Vấn đề đã được khắc phục

### 1. Lỗi "Cannot read properties of undefined (reading '0')" trong books-items.tsx

**Vấn đề:** Lỗi xảy ra ở dòng 13 khi truy cập `book.images[0].url` mà `book.images` có thể là `undefined` hoặc mảng rỗng.

**Giải pháp:** Thêm kiểm tra an toàn:
```typescript
src={book.images && book.images.length > 0 ? book.images[0].url : '/placeholder-book.jpg'}
```

### 2. Vấn đề Favourites không được lưu trữ theo user và bị mất khi reload

**Vấn đề:**
- LocalStorage được sử dụng chung cho tất cả users
- Không có cơ chế đồng bộ với backend
- Dữ liệu bị mất khi reload page
- Khi đổi user, favourites của user trước vẫn hiển thị

**Giải pháp:**

#### a) Cập nhật localStorage utils để user-specific:
- Thêm `userId` parameter vào tất cả functions
- Sử dụng key format: `favourites_${userId}`
- Thêm function `clearFavouritesFromLocalStorage`

#### b) Cập nhật favourite-button.tsx:
- Lấy `userInfo` từ Redux store
- Load favourites dựa trên `userId`
- Clear favourites khi không có user
- Hiển thị thông báo khi user chưa đăng nhập

#### c) Cập nhật favourites page:
- Load favourites dựa trên `userId`
- Hiển thị trang login khi user chưa đăng nhập
- Clear favourites khi không có user

#### d) Cập nhật auth slice:
- Clear user-specific favourites khi logout
- Đảm bảo dữ liệu không bị lẫn lộn giữa các users

#### e) Cập nhật Redux store:
- Loại bỏ preloadedState cho favourites
- Load favourites dựa trên user authentication

### 3. Vấn đề mất dữ liệu khi logout và login lại

**Vấn đề:** Khi logout, `localStorage.clear()` xóa toàn bộ localStorage, bao gồm cả dữ liệu của các user khác.

**Giải pháp:**

#### a) Sửa auth slice:
- Thay `localStorage.clear()` bằng `localStorage.removeItem()` cho từng key cụ thể
- Chỉ xóa `userInfo` và `expirationTime`, không xóa toàn bộ localStorage

#### b) Tạo custom hook useFavourites:
- Quản lý việc load favourites một cách tập trung
- Sử dụng `useRef` để tránh load lại favourites khi user không thay đổi
- Đảm bảo favourites chỉ được load khi user thực sự thay đổi

#### c) Cập nhật components:
- Sử dụng `useFavourites` hook thay vì quản lý favourites trực tiếp
- Loại bỏ duplicate logic trong các components

## Các thay đổi chính

1. **frontend/src/components/books-items.tsx**: Thêm safe check cho images
2. **frontend/src/utils/local-storage.ts**: User-specific storage
3. **frontend/src/components/favourite-button.tsx**: Sử dụng useFavourites hook
4. **frontend/src/pages/shop/favourites.tsx**: Sử dụng useFavourites hook
5. **frontend/src/redux/features/auth/auth-slice.ts**: Chỉ xóa user-specific data khi logout
6. **frontend/src/redux/features/store.ts**: Remove preloadedState
7. **frontend/src/redux/features/favourite/favourite-slice.ts**: Type safety improvements
8. **frontend/src/hooks/useFavourites.ts**: Custom hook để quản lý favourites

## Kết quả

- ✅ Không còn lỗi "Cannot read properties of undefined"
- ✅ Favourites được lưu trữ riêng biệt cho từng user
- ✅ Dữ liệu không bị mất khi reload page
- ✅ Khi đổi user, favourites được load đúng cho user đó
- ✅ Khi logout, chỉ xóa dữ liệu của user hiện tại
- ✅ Khi login lại, favourites được load đúng cho user đó
- ✅ Type safety được cải thiện
- ✅ Performance được tối ưu với custom hook 