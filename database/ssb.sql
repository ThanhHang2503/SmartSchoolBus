CREATE DATABASE SSB;
USE SSB;

-- Bảng tài khoản
CREATE TABLE TaiKhoan (
    MaTK INT AUTO_INCREMENT PRIMARY KEY,
    TenDangNhap VARCHAR(50) NOT NULL UNIQUE,
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


-- BẢNG TÀI KHOẢN (Admin, Driver, Parent)
INSERT INTO TaiKhoan (TenDangNhap, MatKhau, VaiTro, TrangThai)
VALUES 
('admin123@gmail.com', '12345', 2, 1),
('driver123@gmail.com', '12345', 3, 1),
('parent123@gmail.com', '12345', 1, 1);

-- QUẢN LÝ (Admin)
INSERT INTO QuanLy (HoTen, SoDienThoai, TrangThai)
VALUES
('Nguyễn Văn A', '0909123456', 1),
('Trần Thị B', '0909567890', 1);

-- TÀI XẾ (Driver)
INSERT INTO TaiXe (HoTen, SoDienThoai, TrangThai)
VALUES
('Phạm Văn C', '0909345678', 1),
('Võ Văn D', '0909456789', 1),
('Nguyễn Hữu E', '0909567891', 1);

-- PHỤ HUYNH (Parent)
INSERT INTO PhuHuynh (HoTen, SoDienThoai, DiaChi)
VALUES
('Lê Thị F', '0909678912', '123 Nguyễn Trãi, Quận 5'),
('Phan Văn G', '0909789123', '45 Trần Hưng Đạo, Quận 1'),
('Đặng Thị H', '0909891234', '67 Lý Thường Kiệt, Quận 10'),
('Hoàng Văn I', '0909902345', '12 Nguyễn Du, Quận 3');

-- HỌC SINH
INSERT INTO HocSinh (HoTen, NgaySinh, Lop, MaPH)
VALUES
('Phan Minh Khang', '2014-04-10', '5A', 1),
('Nguyễn Thị Mai', '2015-06-25', '4B', 1),
('Đặng Minh Quân', '2013-08-12', '6A', 2),
('Phan Gia Bảo', '2015-01-15', '4C', 3),
('Hoàng Lan Anh', '2014-11-30', '5B', 4),
('Lê Văn Tín', '2013-03-05', '6B', 3),
('Nguyễn Mỹ Duyên', '2015-09-09', '4A', 2),
('Phan Anh Khoa', '2014-02-22', '5C', 1);

-- XE BUS
INSERT INTO XeBus (BienSo, SoCho, TinhTrang, MaQL)
VALUES
('51B-12345', 30, 1, 1),
('51B-67890', 40, 1, 2),
('51C-23456', 25, 1, 1);

-- TUYẾN ĐƯỜNG
INSERT INTO TuyenDuong (NoiBatDau, NoiKetThuc, VanTocTB, DoDai)
VALUES
('Trường Tiểu học A', 'Khu dân cư Bình Tân', 35.5, 10.2),
('Trường Tiểu học A', 'Chung cư Phú Mỹ Hưng', 30.0, 12.5),
('Trường Tiểu học A', 'Đường Nguyễn Văn Cừ', 28.5, 8.7);

-- LỊCH TRÌNH
INSERT INTO LichTrinh (Ngay, GioBatDau, GioKetThuc, MaTX, MaXe, MaTD)
VALUES
('2025-10-28', '06:30:00', '07:30:00', 1, 1, 1),
('2025-10-28', '06:45:00', '07:45:00', 2, 2, 2),
('2025-10-28', '07:00:00', '08:00:00', 3, 3, 3);

-- CHI TIẾT LỊCH TRÌNH (Học sinh đi xe)
INSERT INTO CTLT (MaLT, MaHS, TrangThai)
VALUES
(1, 1, 1),
(1, 2, 0),
(2, 3, 1),
(2, 4, 2),
(3, 5, 1),
(3, 6, 1),
(3, 7, 0);

-- TRẠM DỪNG
INSERT INTO TramDung (DiaChi, TenTram)
VALUES
('123 Nguyễn Văn Linh, Quận 7', 'Trạm A'),
('56 Nguyễn Trãi, Quận 5', 'Trạm B'),
('98 Cách Mạng Tháng 8, Quận 3', 'Trạm C'),
('32 Lý Thường Kiệt, Quận 10', 'Trạm D');

-- CHI TIẾT TUYẾN ĐƯỜNG
INSERT INTO CTTD (MaTram, MaTD, ThuTuDung)
VALUES
(1, 1, 1),
(2, 1, 2),
(3, 2, 1),
(4, 2, 2),
(1, 3, 1),
(4, 3, 2);
