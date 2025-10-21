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
