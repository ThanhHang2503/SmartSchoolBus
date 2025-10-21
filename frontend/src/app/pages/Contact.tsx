import React from "react";

const Contact: React.FC = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-sky-800">Liên hệ</h2>
      <div className="bg-sky-50 p-4 rounded-xl shadow-sm space-y-3 text-black">
        <div>
          <p className="font-semibold">Tài xế: Trần Văn B</p>
          <p>📞 0909 123 456</p>
        </div>
        <div>
          <p className="font-semibold">Nhà trường: Trường Tiểu học DEF</p>
          <p>☎️ 028 1234 5678</p>
        </div>
        <div>
          <p className="font-semibold">Hỗ trợ kỹ thuật SSB</p>
          <p>📧 support@ssb.vn</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
