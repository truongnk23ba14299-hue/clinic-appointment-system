// Dữ liệu giả (mock data) nâng cấp cho MedBooking
const SPECIALTIES = [
  "Nội khoa",
  "Nhi khoa",
  "Da liễu",
  "Tim mạch",
  "Tai Mũi Họng",
  "Mắt"
];

const DOCTORS = [
  // Nội khoa
  { 
    id: "d1",  
    name: "BS. CKII Nguyễn Văn An",   
    specialty: "Nội khoa",     
    initials: "AN", 
    years: 12, 
    rating: 4.9, 
    reviews: 128, 
    note: "Khám tổng quát, bệnh mãn tính, tầm soát sức khỏe định kỳ", 
    color: "#0D9488",
    bio: "BS. CKII Nguyễn Văn An là chuyên gia hàng đầu về Nội khoa với hơn 12 năm kinh nghiệm thăm khám và điều trị tại các bệnh viện tuyến trung ương. Bác sĩ nổi tiếng với sự tận tâm, chẩn đoán chính xác các bệnh lý phức tạp và tư vấn phác đồ điều trị nhẹ nhàng, hiệu quả cho bệnh nhân.",
    education: [
      "Tốt nghiệp Bác sĩ Đa khoa - Đại học Y Hà Nội",
      "Bác sĩ Chuyên khoa II Nội tổng quát - Đại học Y Dược TP.HCM",
      "Chứng chỉ Chẩn đoán hình ảnh & Tầm soát bệnh tim mạch",
      "Thành viên Hội Nội khoa Việt Nam"
    ],
    experienceList: [
      "2012 - 2017: Bác sĩ Nội khoa - Bệnh viện Đa khoa Trung ương",
      "2017 - 2022: Phó khoa Nội tổng hợp - Bệnh viện Quốc tế",
      "2022 - Nay: Bác sĩ Chuyên khoa II Nội khoa - Phòng khám MedBooking"
    ],
    schedule: "Thứ 2 - Thứ 6 (08:00 - 16:30)"
  },
  { 
    id: "d1b", 
    name: "ThS.BS Đặng Thị Mai",    
    specialty: "Nội khoa",     
    initials: "ĐM", 
    years: 7,  
    rating: 4.8, 
    reviews: 95,  
    note: "Nội tiết, tiểu đường, đái tháo đường & rối loạn chuyển hóa", 
    color: "#0284C7",
    bio: "ThS.BS Đặng Thị Mai có kinh nghiệm chuyên sâu về các bệnh lý nội tiết và đái tháo đường. Bác sĩ luôn đồng hành cùng bệnh nhân trong việc kiểm soát chỉ số đường huyết và duy trì lối sống lành mạnh.",
    education: [
      "Tốt nghiệp Thạc sĩ Y khoa - Đại học Y Hà Nội",
      "Chứng chỉ Chuyên khoa Nội tiết & Rối loạn chuyển hóa",
      "Thành viên Hội Đái tháo đường & Nội tiết Việt Nam"
    ],
    experienceList: [
      "2017 - 2021: Bác sĩ điều trị Khoa Nội tiết - Bệnh viện Nội tiết Trung ương",
      "2021 - Nay: Bác sĩ Chuyên khoa Nội tiết - Phòng khám MedBooking"
    ],
    schedule: "Thứ 2 - Thứ 7 (08:30 - 16:00)"
  },
  { 
    id: "d1c", 
    name: "BS. CKI Trịnh Văn Sơn",   
    specialty: "Nội khoa",     
    initials: "TS", 
    years: 16, 
    rating: 5.0, 
    reviews: 210, 
    note: "Tiêu hóa, gan mật, nội soi tiêu hóa không đau", 
    color: "#4F46E5",
    bio: "BS. CKI Trịnh Văn Sơn với 16 năm kinh nghiệm chuyên ngành Nội tiêu hóa và Gan mật. Bác sĩ đã thực hiện hàng nghìn ca nội soi tiêu hóa chẩn đoán và điều trị hiệu quả các bệnh lý dạ dày, đại tràng.",
    education: [
      "Bác sĩ Chuyên khoa I Nội tiêu hóa - Đại học Y Hà Nội",
      "Chứng chỉ Nội soi tiêu hóa nâng cao - Bệnh viện Bạch Mai"
    ],
    experienceList: [
      "2008 - 2018: Bác sĩ Nội tiêu hóa - Bệnh viện Bạch Mai",
      "2018 - Nay: Bác sĩ Chuyên khoa Tiêu hóa - Phòng khám MedBooking"
    ],
    schedule: "Thứ 3 - Chủ Nhật (08:00 - 15:30)"
  },

  // Nhi khoa
  { 
    id: "d2",  
    name: "BS. CKI Trần Thị Bình",   
    specialty: "Nhi khoa",     
    initials: "TB", 
    years: 8,  
    rating: 4.9, 
    reviews: 164, 
    note: "Khám nhi tổng quát, tư vấn vắc xin & tiêm chủng", 
    color: "#EC4899",
    bio: "BS. CKI Trần Thị Bình rất mát tay trong việc chăm sóc và điều trị cho trẻ nhỏ. Với phương pháp thăm khám nhẹ nhàng, không gây sợ hãi cho bé, bác sĩ luôn nhận được sự tin tưởng tuyệt đối từ các bậc phụ huynh.",
    education: [
      "Bác sĩ Chuyên khoa I Nhi khoa - Đại học Y Dược TP.HCM",
      "Chứng chỉ An toàn tiêm chủng & Dinh dưỡng Nhi khoa"
    ],
    experienceList: [
      "2016 - 2020: Bác sĩ Nhi khoa - Bệnh viện Nhi Đồng",
      "2020 - Nay: Bác sĩ Nhi khoa - Phòng khám MedBooking"
    ],
    schedule: "Thứ 2 - Thứ 6 (08:00 - 16:30)"
  },
  { 
    id: "d2b", 
    name: "ThS.BS Nguyễn Hoàng Nam",
    specialty: "Nhi khoa",     
    initials: "HN", 
    years: 6,  
    rating: 4.7, 
    reviews: 82,  
    note: "Nhi sơ sinh, hô hấp nhi & bệnh lý theo mùa", 
    color: "#8B5CF6",
    bio: "ThS.BS Nguyễn Hoàng Nam chuyên về các bệnh lý hô hấp và sơ sinh ở trẻ em. Bác sĩ tận tình tư vấn cho cha mẹ cách chăm sóc trẻ đúng cách tại nhà.",
    education: [
      "Thạc sĩ Nhi khoa - Đại học Y Hà Nội",
      "Chứng chỉ Hồi sức sơ sinh & Bệnh hô hấp nhi"
    ],
    experienceList: [
      "2018 - 2022: Bác sĩ Khoa Sơ sinh - Bệnh viện Phụ sản Trung ương",
      "2022 - Nay: Bác sĩ Nhi khoa - Phòng khám MedBooking"
    ],
    schedule: "Thứ 2 - Thứ 7 (09:00 - 17:00)"
  },
  { 
    id: "d2c", 
    name: "BS. CKII Lý Thị Hương",    
    specialty: "Nhi khoa",     
    initials: "LH", 
    years: 13, 
    rating: 4.9, 
    reviews: 145, 
    note: "Dinh dưỡng trẻ em, tư vấn tăng trưởng & biếng ăn", 
    color: "#F59E0B",
    bio: "BS. CKII Lý Thị Hương là chuyên gia hàng đầu về Dinh dưỡng và Tăng trưởng trẻ em. Bác sĩ xây dựng thực đơn và lộ trình tăng trưởng khoa học giúp trẻ phát triển toàn diện.",
    education: [
      "Bác sĩ Chuyên khoa II Nhi khoa - Đại học Y Hà Nội",
      "Chứng chỉ Chuyên gia Dinh dưỡng Lâm sàng Viện Dinh dưỡng Quốc gia"
    ],
    experienceList: [
      "2011 - 2019: Bác sĩ Dinh dưỡng - Viện Dinh dưỡng",
      "2019 - Nay: Chuyên gia Dinh dưỡng Nhi - Phòng khám MedBooking"
    ],
    schedule: "Thứ 3 - Thứ 7 (08:00 - 16:00)"
  },

  // Da liễu
  { 
    id: "d3",  
    name: "ThS.BS Lê Minh Cường",   
    specialty: "Da liễu",      
    initials: "MC", 
    years: 10, 
    rating: 4.8, 
    reviews: 112, 
    note: "Da liễu tổng quát, dị ứng da, thẩm mỹ da nội khoa", 
    color: "#10B981",
    bio: "ThS.BS Lê Minh Cường có kinh nghiệm dày dặn trong chẩn đoán và điều trị các bệnh lý da liễu mãn tính như vảy nến, chàm, dị ứng da và thẩm mỹ da công nghệ cao.",
    education: [
      "Thạc sĩ Da liễu - Đại học Y Hà Nội",
      "Chứng chỉ Ứng dụng Laser trong Da liễu"
    ],
    experienceList: [
      "2014 - 2019: Bác sĩ Da liễu - Bệnh viện Da liễu Trung ương",
      "2019 - Nay: Bác sĩ Da liễu - Phòng khám MedBooking"
    ],
    schedule: "Thứ 2 - Thứ 6 (08:30 - 16:30)"
  },
  { 
    id: "d3b", 
    name: "BS. CKI Phan Thị Ngọc",   
    specialty: "Da liễu",      
    initials: "PN", 
    years: 9,  
    rating: 4.9, 
    reviews: 178, 
    note: "Da liễu thẩm mỹ, trẻ hóa da & phục hồi màng bảo vệ da", 
    color: "#6366F1",
    bio: "BS. CKI Phan Thị Ngọc nổi tiếng với các phác đồ phục hồi da hư tổn và thẩm mỹ nội khoa an toàn, chuẩn y khoa.",
    education: [
      "Bác sĩ Chuyên khoa I Da liễu - Đại học Y Dược TP.HCM",
      "Chứng chỉ Thẩm mỹ Da liễu Quốc tế"
    ],
    experienceList: [
      "2015 - 2020: Bác sĩ Thẩm mỹ Da - Bệnh viện Da liễu TP.HCM",
      "2020 - Nay: Chuyên gia Da liễu - Phòng khám MedBooking"
    ],
    schedule: "Thứ 2 - Thứ 7 (09:00 - 17:00)"
  },
  { 
    id: "d3c", 
    name: "BS. CKII Đỗ Văn Tùng",     
    specialty: "Da liễu",      
    initials: "ĐT", 
    years: 14, 
    rating: 4.8, 
    reviews: 93,  
    note: "Điều trị mụn chuẩn y khoa, trị sẹo rỗ & tăng sắc tố", 
    color: "#3B82F6",
    bio: "BS. CKII Đỗ Văn Tùng chuyên điều trị các tình trạng mụn trứng cá nặng, sẹo rỗ và thâm nám lâu năm bằng liệu pháp y khoa tiên tiến.",
    education: [
      "Bác sĩ Chuyên khoa II Da liễu - Đại học Y Hà Nội"
    ],
    experienceList: [
      "2010 - 2018: Bác sĩ Da liễu - Bệnh viện 108",
      "2018 - Nay: Bác sĩ Da liễu - Phòng khám MedBooking"
    ],
    schedule: "Thứ 3 - Chủ Nhật (08:00 - 16:00)"
  },

  // Tim mạch
  { 
    id: "d4",  
    name: "PGS.TS Phạm Thu Hà",     
    specialty: "Tim mạch",     
    initials: "TH", 
    years: 15, 
    rating: 5.0, 
    reviews: 310, 
    note: "Khám tim mạch, cao huyết áp & bệnh lý van tim", 
    color: "#EF4444",
    bio: "PGS.TS Phạm Thu Hà là chuyên gia hàng đầu về Tim mạch học tại Việt Nam. Phó Giáo sư đã có hàng trăm đề tài nghiên cứu quốc tế và điều trị thành công hàng ngàn bệnh nhân mắc bệnh tim phức tạp.",
    education: [
      "Phó Giáo sư, Tiến sĩ Y khoa - Viện Tim mạch Việt Nam",
      "Bác sĩ Nội trú Tim mạch - Đại học Y Hà Nội",
      "Fellowship về Tim mạch can thiệp - Pháp"
    ],
    experienceList: [
      "2009 - 2020: Chuyên gia Tim mạch - Viện Tim mạch Quốc gia",
      "2020 - Nay: Cố vấn Chuyên môn Tim mạch - Phòng khám MedBooking"
    ],
    schedule: "Thứ 2, Thứ 4, Thứ 6 (08:00 - 12:00)"
  },
  { 
    id: "d4b", 
    name: "ThS.BS Vũ Đình Long",    
    specialty: "Tim mạch",     
    initials: "ĐL", 
    years: 11, 
    rating: 4.8, 
    reviews: 87,  
    note: "Loạn nhịp tim, siêu âm tim màu Doppler & điện tâm đồ", 
    color: "#06B6D4",
    bio: "ThS.BS Vũ Đình Long chuyên về siêu âm tim màu Doppler và tầm soát sớm các rối loạn nhịp tim.",
    education: [
      "Thạc sĩ Tim mạch - Đại học Y Dược TP.HCM",
      "Chứng chỉ Siêu âm Tim Doppler Tim mạch"
    ],
    experienceList: [
      "2013 - 2019: Bác sĩ Chẩn đoán hình ảnh Tim mạch - Bệnh viện Chợ Rẫy",
      "2019 - Nay: Bác sĩ Tim mạch - Phòng khám MedBooking"
    ],
    schedule: "Thứ 3 - Thứ 7 (08:00 - 16:30)"
  },
  { 
    id: "d4c", 
    name: "BS. CKII Bùi Thị Thanh",   
    specialty: "Tim mạch",     
    initials: "BT", 
    years: 18, 
    rating: 4.9, 
    reviews: 240, 
    note: "Suy tim, bệnh mạch vành & xơ vữa động mạch", 
    color: "#D97706",
    bio: "BS. CKII Bùi Thị Thanh có 18 năm kinh nghiệm trong quản lý suy tim và theo dõi bệnh nhân sau can thiệp mạch vành.",
    education: [
      "Bác sĩ Chuyên khoa II Tim mạch - Đại học Y Hà Nội"
    ],
    experienceList: [
      "2006 - 2018: Bác sĩ Tim mạch - Bệnh viện Tim Hà Nội",
      "2018 - Nay: Bác sĩ Chuyên khoa Tim mạch - Phòng khám MedBooking"
    ],
    schedule: "Thứ 2 - Thứ 6 (08:00 - 16:00)"
  },

  // Tai Mũi Họng
  { 
    id: "d5",  
    name: "BS. CKI Hoàng Văn Đức",   
    specialty: "Tai Mũi Họng", 
    initials: "VĐ", 
    years: 9,  
    rating: 4.8, 
    reviews: 105, 
    note: "Tai mũi họng tổng quát, viêm họng, viêm amidan", 
    color: "#14B8A6",
    bio: "BS. CKI Hoàng Văn Đức am hiểu sâu sắc về bệnh lý tai mũi họng người lớn và trẻ em. Bác sĩ ưu tiên điều trị bảo tốn và tư vấn kỹ lưỡng phòng ngừa tái phát.",
    education: [
      "Bác sĩ Chuyên khoa I Tai Mũi Họng - Đại học Y Hà Nội",
      "Chứng chỉ Nội soi Tai Mũi Họng kỹ thuật cao"
    ],
    experienceList: [
      "2015 - 2020: Bác sĩ Tai Mũi Họng - Bệnh viện Tai Mũi Họng TW",
      "2020 - Nay: Bác sĩ Tai Mũi Họng - Phòng khám MedBooking"
    ],
    schedule: "Thứ 2 - Thứ 6 (08:00 - 16:30)"
  },
  { 
    id: "d5b", 
    name: "ThS.BS Ngô Thị Yến",     
    specialty: "Tai Mũi Họng", 
    initials: "NY", 
    years: 5,  
    rating: 4.7, 
    reviews: 76,  
    note: "Viêm xoang, viêm mũi dị ứng & khàn tiếng", 
    color: "#A855F7",
    bio: "ThS.BS Ngô Thị Yến chuyên điều trị viêm xoang mãn tính và các bệnh lý thanh quản, dây thanh.",
    education: [
      "Thạc sĩ Tai Mũi Họng - Đại học Y Dược TP.HCM"
    ],
    experienceList: [
      "2019 - 2022: Bác sĩ điều trị - Bệnh viện Đa khoa",
      "2022 - Nay: Bác sĩ Tai Mũi Họng - Phòng khám MedBooking"
    ],
    schedule: "Thứ 2 - Thứ 7 (09:00 - 17:00)"
  },
  { 
    id: "d5c", 
    name: "BS. CKII Trần Văn Phúc",   
    specialty: "Tai Mũi Họng", 
    initials: "TP", 
    years: 12, 
    rating: 4.9, 
    reviews: 132, 
    note: "Nội soi tai mũi họng tầm soát sớm khối u vùng đầu mặt cổ", 
    color: "#F43F5E",
    bio: "BS. CKII Trần Văn Phúc giàu kinh nghiệm trong nội soi tầm soát ung thư vòm họng và các khối u vùng tai mũi họng.",
    education: [
      "Bác sĩ Chuyên khoa II Tai Mũi Họng - Đại học Y Hà Nội"
    ],
    experienceList: [
      "2012 - 2021: Bác sĩ Tai Mũi Họng - Bệnh viện K",
      "2021 - Nay: Bác sĩ Tai Mũi Họng - Phòng khám MedBooking"
    ],
    schedule: "Thứ 3 - Chủ Nhật (08:00 - 16:00)"
  },

  // Mắt
  { 
    id: "d6",  
    name: "BS. CKI Vũ Thị Lan",      
    specialty: "Mắt",          
    initials: "TL", 
    years: 11, 
    rating: 4.9, 
    reviews: 156, 
    note: "Khám và đo khúc xạ mắt, điều trị nhược thị ở trẻ em", 
    color: "#0EA5E9",
    bio: "BS. CKI Vũ Thị Lan có 11 năm kinh nghiệm trong kiểm soát cận thị học đường, chỉnh kính và điều trị các bệnh mắt phổ biến.",
    education: [
      "Bác sĩ Chuyên khoa I Nhãn khoa - Đại học Y Hà Nội",
      "Chứng chỉ Kiểm soát Cận thị & Chỉnh quang"
    ],
    experienceList: [
      "2013 - 2019: Bác sĩ Nhãn khoa - Bệnh viện Mắt Trung ương",
      "2019 - Nay: Bác sĩ Khoa Mắt - Phòng khám MedBooking"
    ],
    schedule: "Thứ 2 - Thứ 6 (08:00 - 16:30)"
  },
  { 
    id: "d6b", 
    name: "ThS.BS Đinh Văn Hiếu",   
    specialty: "Mắt",          
    initials: "ĐH", 
    years: 8,  
    rating: 4.8, 
    reviews: 91,  
    note: "Tư vấn phẫu thuật khúc xạ Lasik, Femto & ReLEx SMILE", 
    color: "#64748B",
    bio: "ThS.BS Đinh Văn Hiếu là chuyên gia về phẫu thuật khúc xạ điều trị cận - viễn - loạn thị với kỹ thuật xâm lấn tối thiểu.",
    education: [
      "Thạc sĩ Nhãn khoa - Đại học Y Dược TP.HCM",
      "Chứng chỉ Phẫu thuật Khúc xạ Quốc tế"
    ],
    experienceList: [
      "2016 - 2021: Bác sĩ Khúc xạ - Bệnh viện Mắt Quốc tế",
      "2021 - Nay: Bác sĩ Nhãn khoa - Phòng khám MedBooking"
    ],
    schedule: "Thứ 2 - Thứ 7 (09:00 - 17:00)"
  },
  { 
    id: "d6c", 
    name: "BS. CKII Lâm Thị Kim",     
    specialty: "Mắt",          
    initials: "LK", 
    years: 15, 
    rating: 5.0, 
    reviews: 204, 
    note: "Đục thủy tinh thể, Glocom & đái tháo đường võng mạc", 
    color: "#84CC16",
    bio: "BS. CKII Lâm Thị Kim có hơn 15 năm kinh nghiệm chẩn đoán và điều trị bệnh đục thủy tinh thể, thiên đầu thống (Glocom) và tổn thương mắt do tiểu đường.",
    education: [
      "Bác sĩ Chuyên khoa II Nhãn khoa - Đại học Y Hà Nội"
    ],
    experienceList: [
      "2009 - 2020: Bác sĩ Nhãn khoa - Bệnh viện Mắt TP.HCM",
      "2020 - Nay: Trưởng khoa Mắt - Phòng khám MedBooking"
    ],
    schedule: "Thứ 2 - Thứ 6 (08:00 - 16:00)"
  }
];

const DEPT_IMAGES = [
  "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=900&q=70", // Nội khoa
  "https://images.unsplash.com/photo-1632052999447-e542d08d4f7d?auto=format&fit=crop&w=900&q=70", // Nhi khoa
  "https://images.unsplash.com/photo-1676312754401-d97fe43c2c4b?auto=format&fit=crop&w=900&q=70", // Da liễu
  "https://images.unsplash.com/photo-1618939304347-e91b1f33d2ab?auto=format&fit=crop&w=900&q=70", // Tim mạch
  "https://images.unsplash.com/photo-1764727291644-5dcb0b1a0375?auto=format&fit=crop&w=900&q=70", // Tai Mũi Họng
  "https://images.unsplash.com/photo-1539036776273-021ec1d78bec?auto=format&fit=crop&w=900&q=70"  // Mắt
];

const DEPT_INFO = {
  "Nội khoa": {
    subtitle: "Điều trị các bệnh thông thường và chăm sóc sức khỏe tổng quát",
    intro: "Khoa Nội tổng quát của chúng tôi cung cấp dịch vụ chăm sóc toàn diện cho các vấn đề sức khỏe thường gặp hàng ngày, bao gồm sốt, nhiễm trùng và các bệnh mãn tính. Chúng tôi tập trung vào chẩn đoán sớm và chăm sóc sức khỏe dự phòng.",
    services: ["Điều trị sốt và nhiễm trùng", "Quản lý huyết áp", "Theo dõi bệnh tiểu đường", "Khám sức khỏe định kỳ"],
    doctorNote: "Chúng tôi đảm bảo chẩn đoán chính xác và điều trị cá nhân hóa để duy trì sức khỏe tổng thể của bạn."
  },
  "Nhi khoa": {
    subtitle: "Chăm sóc sức khỏe toàn diện cho trẻ sơ sinh, trẻ nhỏ và thanh thiếu niên",
    intro: "Khoa Nhi của chúng tôi đồng hành cùng ba mẹ trong suốt quá trình phát triển của trẻ, từ những ngày đầu sơ sinh đến tuổi vị thành niên, với môi trường khám thân thiện và nhẹ nhàng.",
    services: ["Tiêm chủng theo lịch", "Theo dõi tăng trưởng và dinh dưỡng", "Khám khi sốt, ho, cảm cúm", "Tư vấn sức khỏe trẻ sơ sinh"],
    doctorNote: "Mỗi trẻ là một cá thể riêng biệt — chúng tôi lắng nghe phụ huynh và đồng hành cùng sự phát triển của bé."
  },
  "Da liễu": {
    subtitle: "Chẩn đoán và điều trị các vấn đề về da, tóc và móng",
    intro: "Khoa Da liễu cung cấp dịch vụ khám và điều trị các bệnh lý da liễu phổ biến lẫn chuyên sâu, kết hợp giữa y học và thẩm mỹ da để mang lại làn da khỏe mạnh.",
    services: ["Điều trị mụn và sẹo", "Khám dị ứng da", "Soi da chẩn đoán", "Tư vấn chăm sóc da thẩm mỹ"],
    doctorNote: "Làn da khỏe mạnh bắt đầu từ chẩn đoán đúng — chúng tôi luôn giải thích rõ nguyên nhân trước khi điều trị."
  },
  "Tim mạch": {
    subtitle: "Khám và điều trị các bệnh lý tim mạch, huyết áp",
    intro: "Khoa Tim mạch tập trung vào phát hiện sớm và quản lý lâu dài các bệnh lý tim mạch, giúp bệnh nhân kiểm soát tốt tình trạng sức khỏe và phòng ngừa biến chứng.",
    services: ["Đo điện tâm đồ (ECG)", "Theo dõi huyết áp", "Tầm soát bệnh mạch vành", "Tư vấn lối sống cho người bệnh tim"],
    doctorNote: "Bệnh tim mạch có thể kiểm soát tốt nếu được phát hiện sớm — đừng ngần ngại thăm khám định kỳ."
  },
  "Tai Mũi Họng": {
    subtitle: "Chẩn đoán và điều trị các bệnh lý tai, mũi và họng",
    intro: "Khoa Tai Mũi Họng khám và điều trị các vấn đề thường gặp như viêm họng, viêm xoang, ù tai, cùng các bệnh lý chuyên sâu hơn với trang thiết bị nội soi hiện đại.",
    services: ["Nội soi tai mũi họng", "Điều trị viêm xoang", "Khám ù tai, giảm thính lực", "Điều trị viêm họng mãn tính"],
    doctorNote: "Nhiều vấn đề tai mũi họng có thể điều trị dứt điểm nếu thăm khám kịp thời, đừng để bệnh kéo dài."
  },
  "Mắt": {
    subtitle: "Khám, đo và điều trị các vấn đề về thị lực",
    intro: "Khoa Mắt cung cấp dịch vụ khám mắt toàn diện, từ đo thị lực cơ bản đến tầm soát các bệnh lý mắt phức tạp, giúp bảo vệ đôi mắt của bạn ở mọi lứa tuổi.",
    services: ["Đo thị lực, cắt kính", "Tầm soát đục thủy tinh thể", "Khám khô mắt, viêm kết mạc", "Tư vấn phẫu thuật khúc xạ"],
    doctorNote: "Đôi mắt cần được kiểm tra định kỳ dù không có triệu chứng — phát hiện sớm giúp bảo tồn thị lực tốt hơn."
  }
};

const TIME_SLOTS_MORNING = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00"];
const TIME_SLOTS_AFTERNOON = ["13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];
const TIME_SLOTS = [...TIME_SLOTS_MORNING, ...TIME_SLOTS_AFTERNOON];

// ---------- LocalStorage Helpers ----------
function getAppointments() {
  try {
    return JSON.parse(localStorage.getItem("appointments") || "[]");
  } catch (e) {
    return [];
  }
}

function saveAppointments(list) {
  localStorage.setItem("appointments", JSON.stringify(list));
}

function getTakenSlots(doctorId, date) {
  return getAppointments()
    .filter(a => a.doctorId === doctorId && a.date === date && a.status !== "cancelled")
    .map(a => a.time);
}

// ---------- Services / Packages Data ----------
const CLINIC_SERVICES = [
  {
    id: "s1",
    category: "Gói khám tổng quát",
    name: "Gói Khám Sức Khỏe Cơ Bản",
    price: "850.000 đ",
    popular: false,
    desc: "Tầm soát sức khỏe tổng quát, đánh giá chức năng gan, thận, đường huyết và các chỉ số máu cơ bản.",
    features: [
      "Khám lâm sàng với BS Chuyên khoa Nội",
      "Công thức máu 24 chỉ số",
      "Đo đường huyết lúc đói & Men gan (GOT, GPT)",
      "Đánh giá chức năng thận (Ure, Creatinin)",
      "Đo điện tâm đồ (ECG) & X-quang tim phổi"
    ]
  },
  {
    id: "s2",
    category: "Gói khám tổng quát",
    name: "Gói Khám Sức Khỏe Nâng Cao",
    price: "1.950.000 đ",
    popular: true,
    desc: "Gói tầm soát toàn diện chuyên sâu, kết hợp siêu âm ổ bụng tổng quát và kiểm tra mỡ máu, tim mạch.",
    features: [
      "Tất cả danh mục Gói Cơ Bản",
      "Siêu âm ổ bụng tổng quát màu 4D",
      "Xét nghiệm mỡ máu toàn phần (Cholesterol, Triglyceride, HDL, LDL)",
      "Tầm soát bệnh lý tuyến giáp & Siêu âm tuyến giáp",
      "Tư vấn dinh dưỡng & Phác đồ chăm sóc riêng"
    ]
  },
  {
    id: "s3",
    category: "Gói khám tổng quát",
    name: "Gói Tầm Soát Sức Khỏe VIP / Doanh Nhân",
    price: "3.500.000 đ",
    popular: false,
    desc: "Tầm soát rủi ro đột quỵ, tim mạch chuyên sâu, xét nghiệm Marker tầm soát ung thư sớm phổ biến.",
    features: [
      "Tất cả danh mục Gói Nâng Cao",
      "Xét nghiệm Marker tầm soát ung thư sớm (CEA, AFP, CA 19-9)",
      "Siêu âm tim màu phổ Doppler & Siêu âm động mạch cảnh",
      "Nội soi tai mũi họng bằng ống mềm không đau",
      "Ưu tiên khám không chờ & Nhận kết quả tận nhà"
    ]
  },
  {
    id: "s4",
    category: "Chuyên khoa",
    name: "Khám Chuyên Khoa Nhi & Tiêm Chủng",
    price: "300.000 đ",
    popular: false,
    desc: "Khám tổng quát sự phát triển thể chất của bé, tư vấn lịch tiêm phòng chủng vi-rút đúng chuẩn y tế.",
    features: [
      "Đánh giá chiều cao, cân nặng, sự phát triển vận động",
      "Kiểm tra tai mũi họng & hệ hô hấp",
      "Tư vấn thực đơn dinh dưỡng chống rạch còi",
      "Lập sổ theo dõi tiêm chủng định kỳ"
    ]
  },
  {
    id: "s5",
    category: "Chuyên khoa",
    name: "Khám & Soi Da Thẩm Mỹ Chuyên Sâu",
    price: "450.000 đ",
    popular: false,
    desc: "Soi da vi phẫu, phát hiện mụn ẩn, sắc tố nám, tổn thương da và xây dựng liệu trình phục hồi.",
    features: [
      "Soi da cắt lớp vi tính AI phân tích độ ẩm & sắc tố",
      "Chẩn đoán viêm da, mụn trứng cá, sẹo rỗ",
      "Kê đơn dược mỹ phẩm chuẩn y khoa",
      "Tặng 1 buổi chăm sóc làm sạch da chuyên sâu"
    ]
  },
  {
    id: "s6",
    category: "Xét nghiệm",
    name: "Xét Nghiệm Vi-rút & Tầm Soát Bệnh Lý",
    price: "600.000 đ",
    popular: false,
    desc: "Xét nghiệm định lượng vi-rút Viêm gan B, C, cúm mùa, sốt xuất huyết Dengue nhận kết quả sau 2 giờ.",
    features: [
      "Lấy máu nhẹ nhàng không đau",
      "Kết quả chính xác 99.9% công nghệ tự động",
      "Trả kết quả online qua tin nhắn / file PDF",
      "Bác sĩ tư vấn miễn phí sau khi có kết quả"
    ]
  }
];

// ---------- Doctor Reviews Helper ----------
const MOCK_REVIEWS = {
  "d1": [
    { id: "r1", name: "Nguyễn Văn Hùng", rating: 5, date: "10/09/2026", comment: "Bác sĩ An giải thích rất kĩ lưỡng và nhẹ nhàng. Tôi bị đau dạ dày nhiều năm khám nhiều nơi không khỏi, nhờ bác sĩ kê đơn chuẩn giờ đã đỡ hẳn.", verified: true },
    { id: "r2", name: "Trần Thị Mai", rating: 5, date: "02/09/2026", comment: "Phòng khám sạch đẹp, bác sĩ An thăm khám tận tình, không lạm dụng kháng sinh. Rất hài lòng!", verified: true },
    { id: "r3", name: "Lê Hoàng Nam", rating: 4, date: "25/08/2026", comment: "Bác sĩ có chuyên môn cao, thời gian chờ khám hơi đông một chút nhưng chất lượng tư vấn rất xứng đáng.", verified: true }
  ],
  "d1c": [
    { id: "r4", name: "Phạm Quốc Bảo", rating: 5, date: "12/09/2026", comment: "Nội soi dạ dày với bác sĩ Sơn nhẹ nhàng vô cùng, không hề có cảm giác đau hay khó chịu. Cảm ơn bác sĩ!", verified: true }
  ],
  "d2": [
    { id: "r5", name: "Nguyễn Thị Ngọc", rating: 5, date: "14/09/2026", comment: "BS Bình rất dịu dàng với em bé, bé nhà mình bình thường sợ bác sĩ lắm mà gặp cô Bình lại ngoan ngoãn hợp tác.", verified: true }
  ]
};

function getDoctorReviews(doctorId) {
  try {
    const stored = JSON.parse(localStorage.getItem("doc_reviews_" + doctorId));
    if (stored && Array.isArray(stored)) return stored;
  } catch (e) {}
  return MOCK_REVIEWS[doctorId] || [
    { id: "r_default1", name: "Bệnh nhân ẩn danh", rating: 5, date: "05/09/2026", comment: "Bác sĩ thăm khám rất tận tâm, lắng nghe ý kiến bệnh nhân và tư vấn giải pháp hiệu quả.", verified: true },
    { id: "r_default2", name: "Phạm Minh Anh", rating: 5, date: "28/08/2026", comment: "Quy trình làm việc nhanh gọn, bác sĩ nhiệt tình dặn dò kỹ trước khi về.", verified: true }
  ];
}

function saveDoctorReview(doctorId, newReview) {
  const list = getDoctorReviews(doctorId);
  list.unshift(newReview);
  localStorage.setItem("doc_reviews_" + doctorId, JSON.stringify(list));
  return list;
}

function formatDate(isoStr) {
  if (!isoStr) return "";
  const parts = isoStr.split("-");
  if (parts.length !== 3) return isoStr;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

// ---------- Mobile Menu Setup ----------
function initMobileMenu() {
  const headerWrap = document.querySelector(".site-header .wrap");
  if (!headerWrap || document.querySelector(".mobile-toggle")) return;

  const toggleBtn = document.createElement("button");
  toggleBtn.className = "mobile-toggle";
  toggleBtn.setAttribute("aria-label", "Mở menu điều hướng");
  toggleBtn.innerHTML = `
    <svg class="icon-menu" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="4" y1="6" x2="20" y2="6"></line>
      <line x1="4" y1="12" x2="20" y2="12"></line>
      <line x1="4" y1="18" x2="20" y2="18"></line>
    </svg>
    <svg class="icon-close" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none;">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  `;

  headerWrap.appendChild(toggleBtn);

  const mainNav = document.querySelector(".main-nav");
  toggleBtn.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("mobile-open");
    toggleBtn.querySelector(".icon-menu").style.display = isOpen ? "none" : "block";
    toggleBtn.querySelector(".icon-close").style.display = isOpen ? "block" : "none";
    toggleBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  document.addEventListener("click", (e) => {
    if (!headerWrap.contains(e.target) && mainNav.classList.contains("mobile-open")) {
      mainNav.classList.remove("mobile-open");
      toggleBtn.querySelector(".icon-menu").style.display = "block";
      toggleBtn.querySelector(".icon-close").style.display = "none";
      toggleBtn.setAttribute("aria-expanded", "false");
    }
  });
}

document.addEventListener("DOMContentLoaded", initMobileMenu);