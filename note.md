### socketio
#### client -> emit() -> server -> emit() -> client
#### rooms
#### .join(roomId); -> server

#### server

- Đăng nhập bằng tài khoản mạng xã hội: Google, Facebook, Linked // Huyền // trong folder passport
- Tham gia cuộc họp đã tạo // Huyền, cái này chắc gv ko hỏi, chỉ chuyển link thôi
- Tạo một cuộc họp // Huyền
- Bật/tắt micro // Huyền
- Đặt câu hỏi (có thể đặt câu hỏi ở dạng ẩn danh) // Huyền
- Bật full màn hình // Huyền
- Xem thông tin cuộc họp, copy đường link cuộc họp // Huyền
- Xem danh sách người tham gia cuộc họp // Huyền
- Đổi tên hiển thị của bản thân // Huyền
- Chat trong cuộc họp // Huyền
- Gửi hình ảnh, gửi file // Huyền
- Rời khỏi cuộc họp // Huyền

===========
- Đăng nhập bằng tài khoản mạng xã hội: Google, Facebook, Linked // Huyền
- Đăng nhập đăng ký tài khoản bằng email
- Đăng xuất tài khoản
- Quản lý thông tin cá nhân
- Đổi avatar
- Xem thông tin các cuộc họp đã tạo
- Đổi tên cuộc họp
- Xoá cuộc họp
- Tham gia cuộc họp đã tạo // Huyền, cái này chắc gv ko hỏi, chỉ chuỷen link thôi
- Tạo mới một cuộc họp
- Tham gia một cuộc họp // Huyền
- Bật/tắt camera 
- Bật/tắt micro // Huyền
- Share màn hình
- Đặt câu hỏi (có thể đặt câu hỏi ở dạng ẩn danh) // Huyền
===========
- Tạo mới một whiteboard 
- Record lại màn hình 
- Bật full màn hình // Huyền
- Tạo cuộc bình chọn // Huyền
- Xem thông tin cuộc họp, copy đường link cuộc họp // Huyền
- Xem danh sách người tham gia cuộc họp // Huyền
- Tìm kiếm người tham gia cuộc họp
- Gửi email mời người tham gia cuộc họp
- Đổi tên hiển thị của bản thân // Huyền
- Nếu chủ phòng thì có thể tắt micro của người khác
- Chat trong cuộc họp // Huyền
- Gửi hình ảnh, gửi file // Huyền
- Rời khỏi cuộc họp // Huyền
- Giới hạn số lượng người tham gia

###
client 1   ----------------- client 2
peer connect -------------- peer connect
offer (thông số của kết nối như là độ phân giải, định dạng, codecs, mã hóa,) -> gửi tới client 2 -> answer -> client 1
###
client 1 - client 2
client 3
