CREATE DATABASE IF NOT EXISTS SSB;
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
    MaTK INT,
    FOREIGN KEY (MaTK) REFERENCES TaiKhoan(MaTK)
);

-- Bảng trạm dừng
CREATE TABLE TramDung (
    MaTram INT AUTO_INCREMENT PRIMARY KEY,
    TenTram VARCHAR(100),
    DiaChi VARCHAR(200),
    KinhDo DECIMAL(10,7),
    ViDo DECIMAL(10,7)
);

-- Bảng học sinh
CREATE TABLE HocSinh (
    MaHS INT AUTO_INCREMENT PRIMARY KEY,
    HoTen VARCHAR(100) NOT NULL,
    NgaySinh DATE,
    Lop VARCHAR(50),
    MaPH INT,
    DiemDon INT,
    DiemTra INT,
    FOREIGN KEY (MaPH) REFERENCES PhuHuynh(MaPH),
    FOREIGN KEY (DiemDon) REFERENCES TramDung(MaTram),
    FOREIGN KEY (DiemTra) REFERENCES TramDung(MaTram)
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
    BangLai VARCHAR(20),
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

-- Chi tiết tuyến đường (các trạm đi qua + thứ tự)
CREATE TABLE CTTD (
    MaTram INT,
    MaTD INT,
    MaTramDon INT,
    ThuTuDung INT NOT NULL,
    PRIMARY KEY (MaTram, MaTD),
    FOREIGN KEY (MaTram) REFERENCES TramDung(MaTram),
    FOREIGN KEY (MaTD) REFERENCES TuyenDuong(MaTD),
    FOREIGN KEY (MaTramDon) REFERENCES TramDung(MaTram)
);

ALTER TABLE QuanLy 
ADD COLUMN MaTK INT;

UPDATE QuanLy QL
JOIN TaiKhoan TK ON QL.MaQL + 10 = TK.MaTK
SET QL.MaTK = TK.MaTK
WHERE TK.VaiTro = 2;

ALTER TABLE QuanLy
ADD CONSTRAINT FK_QuanLy_TaiKhoan
FOREIGN KEY (MaTK) REFERENCES TaiKhoan(MaTK);

UPDATE TaiXe TX
JOIN TaiKhoan TK ON TX.MaTX + 13 = TK.MaTK -- Đã sửa lại logic +13
SET TX.MaTK = TK.MaTK
WHERE TK.VaiTro = 3;

UPDATE PhuHuynh PH
JOIN TaiKhoan TK ON PH.MaPH = TK.MaTK
SET PH.MaTK = TK.MaTK
WHERE TK.VaiTro = 1; 

ALTER TABLE PhuHuynh
ADD CONSTRAINT FK_PhuHuynh_TaiKhoan
FOREIGN KEY (MaTK) REFERENCES TaiKhoan(MaTK);



-- ======================
-- Tài khoản
-- ======================
INSERT INTO TaiKhoan (MaTK, TenDangNhap, MatKhau, VaiTro, TrangThai) VALUES
(1, 'parent01@gmail.com', '123456', 1, 1),
(2, 'parent02@gmail.com', '123456', 1, 1),
(3, 'parent03@gmail.com', '123456', 1, 1),
(4, 'parent04@gmail.com', '123456', 1, 1),
(5, 'parent05@gmail.com', '123456', 1, 1),
(6, 'parent06@gmail.com', '123456', 1, 1),
(7, 'parent07@gmail.com', '123456', 1, 1),
(8, 'parent08@gmail.com', '123456', 1, 1),
(9, 'parent09@gmail.com', '123456', 1, 1),
(10,'parent10@gmail.com','123456',1,1),
(11, 'admin01@gmail.com', '123456', 2, 1),
(12, 'admin02@gmail.com', '123456', 2, 1),
(13, 'admin03@gmail.com', '123456', 2, 1),
(14, 'driver01@gmail.com', '123456', 3, 1),
(15, 'driver02@gmail.com', '123456', 3, 1),
(16, 'driver03@gmail.com', '123456', 3, 1);

-- ======================
-- Phụ huynh
-- ======================
INSERT INTO PhuHuynh (MaPH, HoTen, SoDienThoai, MaTK) VALUES
(1, 'Bùi Thị Thanh Hằng', '0909123456', 1),
(2, 'Nguyễn Thị Hà', '0909876543', 2),
(3, 'Lê Văn C', '0912345670', 3),
(4, 'Phạm Thị D', '0909988776', 4),
(5, 'Hoàng Văn E', '0911223344', 5),
(6, 'Đặng Thị F', '0912333444', 6),
(7, 'Vũ Văn G', '0909888777', 7),
(8, 'Bùi Thị H', '0909777665', 8),
(9, 'Phan Văn I', '0911556677', 9),
(10,'Trương Thị J','0911445566',10);


-- ======================
-- Trạm dừng
-- ======================
INSERT INTO TramDung (MaTram, TenTram, DiaChi, KinhDo, ViDo) VALUES
(1,'Trạm Lê Lợi','123 Lê Lợi, Q1, TP.HCM',106.6999,10.7769),
(2,'Trạm Nguyễn Trãi','456 Nguyễn Trãi, Q5, TP.HCM',106.6667,10.7553),
(3,'Trạm Trần Hưng Đạo','789 Trần Hưng Đạo, Q1, TP.HCM',106.6880,10.7720),
(4,'Trạm Điện Biên Phủ','1010 Điện Biên Phủ, Q3, TP.HCM',106.6930,10.7795),
(5,'Trạm Phan Xích Long','1111 Phan Xích Long, QPN, TP.HCM',106.6895,10.8033),
(6,'Trạm Cách Mạng Tháng 8','1212 CMT8, Q3, TP.HCM',106.6950,10.7790),
(7,'Trạm Hai Bà Trưng','1313 Hai Bà Trưng, Q1, TP.HCM',106.7000,10.7725),
(8,'Trạm Lý Thường Kiệt','1414 Lý Thường Kiệt, Q10, TP.HCM',106.6610,10.7670),
(9,'Trạm Võ Thị Sáu','1515 Võ Thị Sáu, Q3, TP.HCM',106.6935,10.7775),
(10,'Trạm Nguyễn Huệ','1616 Nguyễn Huệ, Q1, TP.HCM',106.7030,10.7750);

-- ======================
-- Học sinh
-- ======================
INSERT INTO HocSinh (MaHS, HoTen, NgaySinh, Lop, MaPH, DiemDon, DiemTra) VALUES
(1,'Mai Thị Mỹ Duyên','2015-06-15','1A',1,1,4),
(2,'Lê Thị Ngọc Tuyền','2014-03-22','2B',2,2,3),
(3,'Nguyễn Thị E','2015-11-10','1A',3,5,1),
(4,'Phạm Văn F','2014-09-30','2C',4,6,2),
(5,'Hoàng Thị G','2015-01-12','1B',5,7,3),
(6,'Đặng Văn H','2014-05-20','2A',6,8,4),
(7,'Vũ Thị I','2015-03-11','1C',7,9,5),
(8,'Bùi Văn J','2014-08-18','2B',8,10,6),
(9,'Phan Thị K','2015-07-22','1A',9,1,7),
(10,'Trương Văn L','2014-12-02','2C',10,2,8);

-- ======================
-- Quản lý
-- ======================
INSERT INTO QuanLy (MaQL, HoTen, SoDienThoai, TrangThai) VALUES
(1,'Phạm Thị Hương','0912345678',1),
(2,'Nguyễn Văn Xuân','0912345679',1),
(3,'Trần Thị Yến','0912345680',1);

-- ======================
-- Xe bus
-- ======================
INSERT INTO XeBus (MaXe, BienSo, SoCho, TinhTrang, MaQL) VALUES
(1,'51B-12345',40,1,1),
(2,'51B-54321',35,1,2),
(3,'51B-67890',45,1,3);

-- ======================
-- Tài xế
-- ======================
INSERT INTO TaiXe (MaTX, HoTen, SoDienThoai, BangLai, TrangThai) VALUES
(1,'Nguyễn Văn Bảo','0987654321','B2',1),
(2,'Trần Văn Lâm','0976543210','B2',1),
(3,'Lê Văn Kỳ','0965432109','B2',1);

-- ======================
-- Thông báo
-- ======================

INSERT INTO ThongBao (MaTB, NoiDung, LoaiTB) VALUES
(1, 'Xe bus tuyến 1 trễ 10 phút do tắc đường', 'Xe trễ'),
(2, 'Xe bus tuyến 2 gặp sự cố kỹ thuật, tạm dừng hoạt động', 'Sự cố'),
(3, 'Thông báo khác: Học sinh nghỉ học hôm nay theo yêu cầu phụ huynh', 'Khác');

-- ======================
-- Tuyến đường
-- ======================
INSERT INTO TuyenDuong (MaTD, NoiBatDau, NoiKetThuc, VanTocTB, DoDai) VALUES
(1,'Trạm Lê Lợi','Trạm Phan Xích Long',30.5,12.0),
(2,'Trạm Nguyễn Trãi','Trạm Điện Biên Phủ',28.0,10.5),
(3,'Trạm Hai Bà Trưng','Trạm Nguyễn Huệ',32.0,11.2);

-- ======================
-- Lịch trình
-- ======================
-- Chèn 3 bản ghi gốc (MaLT = 1, 2, 3)
INSERT INTO LichTrinh (MaLT, Ngay, GioBatDau, GioKetThuc, MaTX, MaXe, MaTD) VALUES
(1, '2025-11-17', '06:30:00', '07:30:00', 1, 1, 1),
(2, '2025-11-17', '06:45:00', '07:45:00', 2, 2, 2),
(3, '2025-11-17', '06:50:00', '07:50:00', 3, 3, 3);

-- Đảm bảo AUTO_INCREMENT bắt đầu từ 4 cho các bản ghi mới
ALTER TABLE LichTrinh AUTO_INCREMENT = 4;

INSERT INTO LichTrinh (Ngay, GioBatDau, GioKetThuc, MaTX, MaXe, MaTD) VALUES
-- Ngày 2025-11-18 (MaLT = 4, 5, 6)
('2025-11-18', '06:30:00', '07:30:00', 1, 1, 1),
('2025-11-18', '06:45:00', '07:45:00', 2, 2, 2),
('2025-11-18', '06:50:00', '07:50:00', 3, 3, 3),

-- Ngày 2025-11-19
('2025-11-19', '06:30:00', '07:30:00', 1, 1, 1),
('2025-11-19', '06:45:00', '07:45:00', 2, 2, 2),
('2025-11-19', '06:50:00', '07:50:00', 3, 3, 3),

-- Ngày 2025-11-20
('2025-11-20', '06:30:00', '07:30:00', 1, 1, 1),
('2025-11-20', '06:45:00', '07:45:00', 2, 2, 2),
('2025-11-20', '06:50:00', '07:50:00', 3, 3, 3),

-- Ngày 2025-11-21
('2025-11-21', '06:30:00', '07:30:00', 1, 1, 1),
('2025-11-21', '06:45:00', '07:45:00', 2, 2, 2),
('2025-11-21', '06:50:00', '07:50:00', 3, 3, 3),

-- Ngày 2025-11-22
('2025-11-22', '06:30:00', '07:30:00', 1, 1, 1),
('2025-11-22', '06:45:00', '07:45:00', 2, 2, 2),
('2025-11-22', '06:50:00', '07:50:00', 3, 3, 3),

-- Ngày 2025-11-23
('2025-11-23', '06:30:00', '07:30:00', 1, 1, 1),
('2025-11-23', '06:45:00', '07:45:00', 2, 2, 2),
('2025-11-23', '06:50:00', '07:50:00', 3, 3, 3),

-- Ngày 2025-11-24
('2025-11-24', '06:30:00', '07:30:00', 1, 1, 1),
('2025-11-24', '06:45:00', '07:45:00', 2, 2, 2),
('2025-11-24', '06:50:00', '07:50:00', 3, 3, 3),

-- Ngày 2025-11-25
('2025-11-25', '06:30:00', '07:30:00', 1, 1, 1),
('2025-11-25', '06:45:00', '07:45:00', 2, 2, 2),
('2025-11-25', '06:50:00', '07:50:00', 3, 3, 3),

-- Ngày 2025-11-26
('2025-11-26', '06:30:00', '07:30:00', 1, 1, 1),
('2025-11-26', '06:45:00', '07:45:00', 2, 2, 2),
('2025-11-26', '06:50:00', '07:50:00', 3, 3, 3),

-- Ngày 2025-11-27
('2025-11-27', '06:30:00', '07:30:00', 1, 1, 1),
('2025-11-27', '06:45:00', '07:45:00', 2, 2, 2),
('2025-11-27', '06:50:00', '07:50:00', 3, 3, 3),

-- Ngày 2025-11-28
('2025-11-28', '06:30:00', '07:30:00', 1, 1, 1),
('2025-11-28', '06:45:00', '07:45:00', 2, 2, 2),
('2025-11-28', '06:50:00', '07:50:00', 3, 3, 3),

-- Ngày 2025-11-29
('2025-11-29', '06:30:00', '07:30:00', 1, 1, 1),
('2025-11-29', '06:45:00', '07:45:00', 2, 2, 2),
('2025-11-29', '06:50:00', '07:50:00', 3, 3, 3),

-- Ngày 2025-11-30
('2025-11-30', '06:30:00', '07:30:00', 1, 1, 1),
('2025-11-30', '06:45:00', '07:45:00', 2, 2, 2),
('2025-11-30', '06:50:00', '07:50:00', 3, 3, 3),

-- Ngày 2025-12-01
('2025-12-01', '06:30:00', '07:30:00', 1, 1, 1),
('2025-12-01', '06:45:00', '07:45:00', 2, 2, 2),
('2025-12-01', '06:50:00', '07:50:00', 3, 3, 3);
-- ======================
-- Chi tiết lịch trình
-- ======================
INSERT INTO CTLT (MaLT, MaHS, TrangThai) VALUES
(1,1,0),(1,2,0),(1,3,0),
(2,4,0),(2,5,0),(2,6,0),
(3,7,0),(3,8,0),(3,9,0),(3,10,0);

-- ======================
-- Chi tiết tuyến đường
-- ======================
INSERT INTO CTTD (MaTram, MaTD, MaTramDon, ThuTuDung) VALUES
(1,1,1,1),(2,1,2,2),(3,1,3,3),(4,1,4,4),(5,1,5,5),
(2,2,2,1),(3,2,3,2),(4,2,4,3),(5,2,5,4),(6,2,6,5),
(7,3,7,1),(8,3,8,2),(9,3,9,3),(10,3,10,4);
