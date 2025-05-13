export const mockUsers = {
  pending: [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@email.com",
      role: "buyer",
      location: "Quezon City, Metro Manila",
      landArea: "500 sqm",
      registrationDate: "2024-03-15",
      status: "pending",
      idType: "Passport",
      idNumber: "P123456789",
      idImage: "https://picsum.photos/400/300",
      selfieImage: "https://picsum.photos/400/300",
      profileImage: "https://picsum.photos/40/40"
    },
    {
      id: 2,
      name: "Maria Garcia",
      email: "maria.garcia@email.com",
      role: "seller",
      location: "Makati City, Metro Manila",
      landArea: "1000 sqm",
      registrationDate: "2024-03-14",
      status: "pending",
      idType: "Driver's License",
      idNumber: "DL987654321",
      idImage: "https://picsum.photos/400/300",
      selfieImage: "https://picsum.photos/400/300",
      profileImage: "https://picsum.photos/40/40"
    }
  ],
  approved: [
    {
      id: 3,
      name: "Robert Chen",
      email: "robert.chen@email.com",
      role: "buyer",
      location: "Taguig City, Metro Manila",
      landArea: "750 sqm",
      registrationDate: "2024-03-10",
      status: "approved",
      approvalDate: "2024-03-12",
      idType: "National ID",
      idNumber: "NID123456789",
      profileImage: "https://picsum.photos/40/40"
    },
    {
      id: 4,
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      role: "seller",
      location: "Pasig City, Metro Manila",
      landArea: "2000 sqm",
      registrationDate: "2024-03-08",
      status: "approved",
      approvalDate: "2024-03-09",
      idType: "Passport",
      idNumber: "P987654321",
      profileImage: "https://picsum.photos/40/40"
    }
  ],
  rejected: [
    {
      id: 5,
      name: "Michael Brown",
      email: "michael.b@email.com",
      role: "buyer",
      location: "Manila City",
      landArea: "300 sqm",
      registrationDate: "2024-03-05",
      status: "rejected",
      rejectionDate: "2024-03-06",
      rejectionReason: "Incomplete documentation",
      idType: "Driver's License",
      idNumber: "DL456789123",
      profileImage: "https://picsum.photos/40/40"
    },
    {
      id: 6,
      name: "Lisa Wong",
      email: "lisa.w@email.com",
      role: "seller",
      location: "Mandaluyong City",
      landArea: "1500 sqm",
      registrationDate: "2024-03-01",
      status: "rejected",
      rejectionDate: "2024-03-02",
      rejectionReason: "Invalid land documentation",
      idType: "National ID",
      idNumber: "NID987654321",
      profileImage: "https://picsum.photos/40/40"
    }
  ]
}; 