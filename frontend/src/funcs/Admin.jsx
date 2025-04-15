import React, { useState, useEffect } from 'react';
import { 
  GlobalStyle, AdminContainer, AdminHeader, AdminTitle, AdminStats,
  StatCard, StatNumber, StatLabel, TabContainer, Tab, SearchInput,
  UsersList, UsersTable, TableHeader, TableRow, TableCell, ViewButton,
  ApproveButton, RejectButton, UserImage, ModalOverlay, ModalContent,
  ModalHeader, ModalTitle, CloseButton, UserDetailGrid, DetailColumn,
  DetailItem, DetailLabel, DetailValue, ImageContainer, ImageLabel,
  IDImage, ModalActions, NavContainer, Logo, Smartland, System, NavLinks,
  NavItem, ProfileSection, Avatar, AppWrapper
} from './AdminStyles';

const Admin = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [pendingUsers, setPendingUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [rejectedUsers, setRejectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch users data (simulated)
  useEffect(() => {
    // In a real application, this would be an API call
    const fetchUsers = () => {
      // Sample data
      const pending = [
        {
          id: 1,
          name: "Juan Santos",
          email: "juan.santos@example.com",
          location: "Brgy. San Vicente, Cabanatuan",
          landArea: "2.5 hectares",
          registrationDate: "2025-04-10",
          idType: "Driver's License",
          idNumber: "N01-12-345678",
          profileImage: "/api/placeholder/40/40",
          idImage: "/api/placeholder/400/250",
          selfieImage: "/api/placeholder/400/250",
          status: "pending"
        },
        {
          id: 2,
          name: "Maria Cruz",
          email: "mariacruz@example.com",
          location: "Brgy. Aduas, Cabanatuan",
          landArea: "1.8 hectares",
          registrationDate: "2025-04-12",
          idType: "Voter's ID",
          idNumber: "7601-123A-12345678",
          profileImage: "/api/placeholder/40/40",
          idImage: "/api/placeholder/400/250",
          selfieImage: "/api/placeholder/400/250",
          status: "pending"
        },
        {
          id: 3,
          name: "Pedro Reyes",
          email: "preyes@example.com",
          location: "Brgy. Valdefuente, Cabanatuan",
          landArea: "3.2 hectares",
          registrationDate: "2025-04-13",
          idType: "Passport",
          idNumber: "P1234567A",
          profileImage: "/api/placeholder/40/40",
          idImage: "/api/placeholder/400/250",
          selfieImage: "/api/placeholder/400/250",
          status: "pending"
        }
      ];

      const approved = [
        {
          id: 4,
          name: "Ana Mendoza",
          email: "ana.mendoza@example.com",
          location: "Brgy. Kapitan Pepe, Cabanatuan",
          landArea: "1.5 hectares",
          registrationDate: "2025-04-08",
          approvalDate: "2025-04-09",
          idType: "Postal ID",
          idNumber: "1234-5678-9012",
          profileImage: "/api/placeholder/40/40",
          status: "approved"
        },
        {
          id: 5,
          name: "Carlo Gomez",
          email: "cgomez@example.com",
          location: "Brgy. Santa Arcadia, Cabanatuan",
          landArea: "4.0 hectares",
          registrationDate: "2025-04-05",
          approvalDate: "2025-04-07",
          idType: "SSS ID",
          idNumber: "33-1234567-8",
          profileImage: "/api/placeholder/40/40",
          status: "approved"
        }
      ];

      const rejected = [
        {
          id: 6,
          name: "Roberto Lim",
          email: "rlim@example.com",
          location: "Brgy. Mabini Extension, Cabanatuan",
          landArea: "0.7 hectares",
          registrationDate: "2025-04-11",
          rejectionDate: "2025-04-13",
          rejectionReason: "ID document unclear",
          idType: "PhilHealth ID",
          idNumber: "12-345678901-2",
          profileImage: "/api/placeholder/40/40",
          status: "rejected"
        }
      ];

      setPendingUsers(pending);
      setApprovedUsers(approved);
      setRejectedUsers(rejected);
    };

    fetchUsers();
  }, []);

  // Filter users based on search term
  const filterUsers = (users) => {
    if (!searchTerm) return users;
    return users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Get current users based on active tab
  const getCurrentUsers = () => {
    switch (activeTab) {
      case "pending":
        return filterUsers(pendingUsers);
      case "approved":
        return filterUsers(approvedUsers);
      case "rejected":
        return filterUsers(rejectedUsers);
      default:
        return [];
    }
  };

  // Handle user approval
  const handleApprove = (userId) => {
    // In a real application, this would be an API call
    const userToApprove = pendingUsers.find(user => user.id === userId);
    if (userToApprove) {
      const updatedUser = {
        ...userToApprove,
        status: "approved",
        approvalDate: new Date().toISOString().split('T')[0]
      };
      
      setPendingUsers(pendingUsers.filter(user => user.id !== userId));
      setApprovedUsers([...approvedUsers, updatedUser]);
      
      if (showModal && selectedUser?.id === userId) {
        setShowModal(false);
      }
    }
  };

  // Handle user rejection
  const handleReject = (userId, reason = "Application did not meet requirements") => {
    // In a real application, this would be an API call
    const userToReject = pendingUsers.find(user => user.id === userId);
    if (userToReject) {
      const updatedUser = {
        ...userToReject,
        status: "rejected",
        rejectionDate: new Date().toISOString().split('T')[0],
        rejectionReason: reason
      };
      
      setPendingUsers(pendingUsers.filter(user => user.id !== userId));
      setRejectedUsers([...rejectedUsers, updatedUser]);
      
      if (showModal && selectedUser?.id === userId) {
        setShowModal(false);
      }
    }
  };

  // View user details
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  // Render user detail modal
  const renderUserModal = () => {
    if (!selectedUser) return null;

    return (
      <ModalOverlay>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>User Verification</ModalTitle>
            <CloseButton onClick={() => setShowModal(false)}>&times;</CloseButton>
          </ModalHeader>

          <UserDetailGrid>
            <DetailColumn>
              <DetailItem>
                <DetailLabel>Full Name</DetailLabel>
                <DetailValue>{selectedUser.name}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Email</DetailLabel>
                <DetailValue>{selectedUser.email}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Registration Date</DetailLabel>
                <DetailValue>{selectedUser.registrationDate}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Land Location</DetailLabel>
                <DetailValue>{selectedUser.location}</DetailValue>
              </DetailItem>
            </DetailColumn>
            <DetailColumn>
              <DetailItem>
                <DetailLabel>Land Area</DetailLabel>
                <DetailValue>{selectedUser.landArea}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>ID Type</DetailLabel>
                <DetailValue>{selectedUser.idType}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>ID Number</DetailLabel>
                <DetailValue>{selectedUser.idNumber}</DetailValue>
              </DetailItem>
              {selectedUser.status === "rejected" && (
                <DetailItem>
                  <DetailLabel>Rejection Reason</DetailLabel>
                  <DetailValue>{selectedUser.rejectionReason}</DetailValue>
                </DetailItem>
              )}
            </DetailColumn>
          </UserDetailGrid>

          {selectedUser.status === "pending" && (
            <>
              <ImageContainer>
                <ImageLabel>ID Document</ImageLabel>
                <IDImage src={selectedUser.idImage} alt="ID Document" />
              </ImageContainer>

              <ImageContainer>
                <ImageLabel>Selfie with ID</ImageLabel>
                <IDImage src={selectedUser.selfieImage} alt="Selfie with ID" />
              </ImageContainer>

              <ModalActions>
                <RejectButton onClick={() => handleReject(selectedUser.id)}>
                  Reject
                </RejectButton>
                <ApproveButton onClick={() => handleApprove(selectedUser.id)}>
                  Approve
                </ApproveButton>
              </ModalActions>
            </>
          )}

          {selectedUser.status === "approved" && (
            <DetailItem>
              <DetailLabel>Approval Date</DetailLabel>
              <DetailValue>{selectedUser.approvalDate}</DetailValue>
            </DetailItem>
          )}

          {selectedUser.status === "rejected" && (
            <DetailItem>
              <DetailLabel>Rejection Date</DetailLabel>
              <DetailValue>{selectedUser.rejectionDate}</DetailValue>
            </DetailItem>
          )}
        </ModalContent>
      </ModalOverlay>
    );
  };

  return (
    <AppWrapper>
      <GlobalStyle />
      
      {/* Navbar */}
      <NavContainer>
        <Logo>
          <Smartland>SMARTLAND</Smartland>
          <System>MANAGEMENT SYSTEM</System>
        </Logo>
        <NavLinks>
          <NavItem>Dashboard</NavItem>
          <NavItem>Land Map</NavItem>
          <NavItem>Reports</NavItem>
          <NavItem>User Verification</NavItem>
        </NavLinks>
        <ProfileSection>
          <Avatar src="/api/placeholder/40/40" alt="Admin" />
        </ProfileSection>
      </NavContainer>
      
      {/* Admin Dashboard */}
      <AdminContainer>
        <AdminHeader>
          <AdminTitle>User Verification</AdminTitle>
          <AdminStats>
            <StatCard>
              <StatNumber>{pendingUsers?.length || 0}</StatNumber>
              <StatLabel>Pending</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{approvedUsers?.length || 0}</StatNumber>
              <StatLabel>Approved</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{rejectedUsers?.length || 0}</StatNumber>
              <StatLabel>Rejected</StatLabel>
            </StatCard>
          </AdminStats>
        </AdminHeader>

        <TabContainer>
          <Tab 
            selected={activeTab === "pending"} 
            onClick={() => setActiveTab("pending")}
          >
            Pending Verification
          </Tab>
          <Tab 
            selected={activeTab === "approved"} 
            onClick={() => setActiveTab("approved")}
          >
            Approved Users
          </Tab>
          <Tab 
            selected={activeTab === "rejected"} 
            onClick={() => setActiveTab("rejected")}
          >
            Rejected Applications
          </Tab>
        </TabContainer>

        <SearchInput 
          type="text" 
          placeholder="Search by name, email, or location..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <UsersList>
          <UsersTable>
            <thead>
              <tr>
                <TableHeader>User</TableHeader>
                <TableHeader>Location</TableHeader>
                <TableHeader>Land Area</TableHeader>
                <TableHeader>Registration Date</TableHeader>
                <TableHeader>Actions</TableHeader>
              </tr>
            </thead>
            <tbody>
              {getCurrentUsers().length > 0 ? (
                getCurrentUsers().map(user => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <UserImage src={user.profileImage} alt={user.name} />
                        <div>
                          <div style={{ fontWeight: 'bold' }}>{user.name}</div>
                          <div style={{ fontSize: '0.9rem', color: '#bdc3c7' }}>{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.location}</TableCell>
                    <TableCell>{user.landArea}</TableCell>
                    <TableCell>{user.registrationDate}</TableCell>
                    <TableCell>
                      <ViewButton onClick={() => handleViewUser(user)}>
                        View Details
                      </ViewButton>
                      
                      {user.status === "pending" && (
                        <>
                          <ApproveButton onClick={() => handleApprove(user.id)}>
                            Approve
                          </ApproveButton>
                          <RejectButton onClick={() => handleReject(user.id)}>
                            Reject
                          </RejectButton>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="5" style={{ textAlign: 'center' }}>
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </tbody>
          </UsersTable>
        </UsersList>
      </AdminContainer>

      {/* User Detail Modal */}
      {showModal && selectedUser && (
        <ModalOverlay>
          <ModalContent>
            {/* Modal content would go here */}
          </ModalContent>
        </ModalOverlay>
      )}
    </AppWrapper>
  );
};

export default Admin;