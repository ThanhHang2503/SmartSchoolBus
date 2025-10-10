CREATE DATABASE SSB;
USE SSB;

-- Bảng tài khoản
CREATE TABLE TaiKhoan (
    MaTK INT AUTO_INCREMENT PRIMARY KEY,
    MatKhau VARCHAR(100) NOT NULL,
    VaiTro INT NOT NULL,       -- 1 = PhuHuynh, 2 = QuanLy, 3 = TaiXe
    TrangThai TINYINT DEFAULT 1 -- 1 = HoatDong, 0 = Khoa
);
-- Bảng thông báo
CREATE TABLE ThongBao (
    MaTB INT AUTO_INCREMENT PRIMARY KEY,
    NoiDung TEXT NOT NULL,
    LoaiTB VARCHAR(50)
);

-- Chi tiết thông báo 
CREATE TABLE CTTB (
    MaTK INT,
    MaTB INT,
    ThoiGian DATETIME NOT NULL,   
    PRIMARY KEY (MaTK, MaTB),
    FOREIGN KEY (MaTK) REFERENCES TaiKhoan(MaTK),
    FOREIGN KEY (MaTB) REFERENCES ThongBao(MaTB)
);

-- Bảng phụ huynh
CREATE TABLE PhuHuynh (
    MaPH INT AUTO_INCREMENT PRIMARY KEY,
    HoTen VARCHAR(100) NOT NULL,
    SoDienThoai VARCHAR(20),
    DiaChi VARCHAR(200)
);

-- Bảng học sinh
CREATE TABLE HocSinh (
    MaHS INT AUTO_INCREMENT PRIMARY KEY,
    HoTen VARCHAR(100) NOT NULL,
    NgaySinh DATE,
    Lop VARCHAR(50),
    MaPH INT,
    FOREIGN KEY (MaPH) REFERENCES PhuHuynh(MaPH)
);

-- Bảng quản lý
CREATE TABLE QuanLy (
    MaQL INT AUTO_INCREMENT PRIMARY KEY,
    HoTen VARCHAR(100) NOT NULL,
    SoDienThoai VARCHAR(20),
    TrangThai TINYINT DEFAULT 1 -- 1 = HoatDong, 0 = Nghi
    
);

-- Bảng xe bus
CREATE TABLE XeBus (
    MaXe INT AUTO_INCREMENT PRIMARY KEY,
    BienSo VARCHAR(20) NOT NULL UNIQUE,
    SoCho INT NOT NULL,
    TinhTrang TINYINT DEFAULT 1, -- 1 = HoatDong, 0 = Ngung/BaoTri
    MaQL INT,
    FOREIGN KEY (MaQL) REFERENCES QuanLy(MaQL)
);

-- Bảng tài xế
CREATE TABLE TaiXe (
    MaTX INT AUTO_INCREMENT PRIMARY KEY,
    HoTen VARCHAR(100) NOT NULL,
    SoDienThoai VARCHAR(20),
    TrangThai TINYINT DEFAULT 1 -- 1 = HoatDong, 0 = Nghi
   
);

-- Bảng tuyến đường
CREATE TABLE TuyenDuong (
    MaTD INT AUTO_INCREMENT PRIMARY KEY,
    NoiBatDau VARCHAR(200),
    NoiKetThuc VARCHAR(200),
    VanTocTB DECIMAL(5,2), -- km/h
    DoDai DECIMAL(6,2)     -- km
);

-- Bảng lịch trình
CREATE TABLE LichTrinh (
    MaLT INT AUTO_INCREMENT PRIMARY KEY,
    Ngay DATE NOT NULL,
    GioBatDau TIME NOT NULL,
    GioKetThuc TIME,
    MaTX INT,
    MaXe INT,
    MaTD INT,
    FOREIGN KEY (MaTX) REFERENCES TaiXe(MaTX),
    FOREIGN KEY (MaXe) REFERENCES XeBus(MaXe),
    FOREIGN KEY (MaTD) REFERENCES TuyenDuong(MaTD)
);

-- Chi tiết lịch trình (học sinh tham gia)
CREATE TABLE CTLT (
    MaLT INT,
    MaHS INT,
    TrangThai TINYINT DEFAULT 0, -- 0 = Chua don, 1 = Da don, 2 = Da tra
    PRIMARY KEY (MaLT, MaHS),
    FOREIGN KEY (MaLT) REFERENCES LichTrinh(MaLT),
    FOREIGN KEY (MaHS) REFERENCES HocSinh(MaHS)
);

-- Bảng trạm dừng
CREATE TABLE TramDung (
    MaTram INT AUTO_INCREMENT PRIMARY KEY,
    DiaChi VARCHAR(200),
    TenTram VARCHAR(100)
);

-- Chi tiết tuyến đường (các trạm đi qua + thứ tự)
CREATE TABLE CTTD (
    MaTram INT,
    MaTD INT,
    ThuTuDung INT NOT NULL,
    PRIMARY KEY (MaTram, MaTD),
    FOREIGN KEY (MaTram) REFERENCES TramDung(MaTram),
    FOREIGN KEY (MaTD) REFERENCES TuyenDuong(MaTD)
);
-- 1. Thêm dữ liệu vào bảng TaiKhoan
INSERT INTO TaiKhoan (MatKhau, VaiTro, TrangThai) VALUES
('phuhuynh123', 1, 1), -- Phụ huynh
('quanly2023', 2, 1),  -- Quản lý
('taixe456', 3, 1);   -- Tài xế

-- 2. Thêm dữ liệu vào bảng ThongBao
INSERT INTO ThongBao (NoiDung, LoaiTB) VALUES
('Xe bus tuyến Quận 7 sẽ trễ 15 phút ngày 11/10/2025 do kẹt xe', 'CanhBao'),
('Cập nhật lịch trình xe bus tháng 10 cho trường THCS Lê Quý Đôn', 'ThongTin'),
('Bảo trì xe bus định kỳ tại gara Quận 9', 'BaoTri');

-- 3. Thêm dữ liệu vào bảng CTTB (Chi tiết thông báo)
INSERT INTO CTTB (MaTK, MaTB, ThoiGian) VALUES
(1, 1, '2025-10-10 07:30:00'),
(2, 2, '2025-10-10 08:00:00'),
(3, 3, '2025-10-10 09:00:00');

-- 4. Thêm dữ liệu vào bảng PhuHuynh
INSERT INTO PhuHuynh (HoTen, SoDienThoai, DiaChi) VALUES
('Nguyen Thi Lan', '0908765432', '123 Nguyễn Thị Minh Khai, Quận 3, TP.HCM'),
('Tran Van Hung', '0912345678', '456 Lê Văn Sỹ, Quận Tân Bình, TP.HCM'),
('Le Thi Mai', '0923456789', '789 Nguyễn Văn Cừ, Quận 5, TP.HCM');

-- 5. Thêm dữ liệu vào bảng HocSinh
INSERT INTO HocSinh (HoTen, NgaySinh, Lop, MaPH) VALUES
('Nguyen Van Minh', '2015-06-15', '5A', 1),
('Tran Thi Hoa', '2016-04-20', '4B', 2),
('Le Van Phuc', '2014-09-10', '6A', 3);

-- 6. Thêm dữ liệu vào bảng QuanLy
INSERT INTO QuanLy (HoTen, SoDienThoai, TrangThai) VALUES
('Pham Van Nam', '0931234567', 1),
('Hoang Thi Thuy', '0942345678', 1),
('Nguyen Van Long', '0953456789', 0);

-- 7. Thêm dữ liệu vào bảng XeBus
INSERT INTO XeBus (BienSo, SoCho, TinhTrang, MaQL) VALUES
('51B-12345', 30, 1, 1),
('51B-67890', 40, 1, 2),
('51B-45678', 25, 0, 3);

-- 8. Thêm dữ liệu vào bảng TaiXe
INSERT INTO TaiXe (HoTen, SoDienThoai, TrangThai) VALUES
('Nguyen Van Hieu', '0961234567', 1),
('Tran Van Duc', '0972345678', 1),
('Le Thi Kim', '0983456789', 0);

-- 9. Thêm dữ liệu vào bảng TuyenDuong
INSERT INTO TuyenDuong (NoiBatDau, NoiKetThuc, VanTocTB, DoDai) VALUES
('Trường THCS Lê Quý Đôn, Quận 3', 'Khu đô thị Phú Mỹ Hưng, Quận 7', 25.5, 10.5),
('Trường Tiểu học Nguyễn Thái Học, Quận 1', 'Khu dân cư Him Lam, Quận 7', 20.0, 8.0),
('Trường THPT Trần Đại Nghĩa, Quận 5', 'Bến xe Miền Đông, Quận Bình Thạnh', 22.0, 12.0);

-- 10. Thêm dữ liệu vào bảng LichTrinh
INSERT INTO LichTrinh (Ngay, GioBatDau, GioKetThuc, MaTX, MaXe, MaTD) VALUES
('2025-10-11', '06:30:00', '08:00:00', 1, 1, 1),
('2025-10-11', '13:30:00', '15:00:00', 2, 2, 2),
('2025-10-12', '07:00:00', '08:30:00', 3, 3, 3);

-- 11. Thêm dữ liệu vào bảng CTLT (Chi tiết lịch trình)
INSERT INTO CTLT (MaLT, MaHS, TrangThai) VALUES
(1, 1, 1), -- Đã đón
(1, 2, 0), -- Chưa đón
(2, 3, 2); -- Đã trả

-- 12. Thêm dữ liệu vào bảng TramDung
INSERT INTO TramDung (DiaChi, TenTram) VALUES
('123 Nguyễn Hữu Cảnh, Quận 1, TP.HCM', 'Trạm Nguyễn Hữu Cảnh'),
('456 Nguyễn Thị Thập, Quận 7, TP.HCM', 'Trạm Nguyễn Thị Thập'),
('789 Phạm Văn Đồng, Quận Bình Thạnh, TP.HCM', 'Trạm Phạm Văn Đồng');

-- 13. Thêm dữ liệu vào bảng CTTD (Chi tiết tuyến đường)
INSERT INTO CTTD (MaTram, MaTD, ThuTuDung) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 2, 1),
(2, 2, 2),
(3, 3, 1);