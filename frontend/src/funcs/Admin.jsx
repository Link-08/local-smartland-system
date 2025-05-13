import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { mockUsers } from '../data/mockUsers';
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
    const [accountLogs, setAccountLogs] = useState([]);

    // Load mock data
    useEffect(() => {
        setPendingUsers(mockUsers.pending);
        setApprovedUsers(mockUsers.approved);
        setRejectedUsers(mockUsers.rejected);
    }, []);

    // Fetch users data from backend
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.log('No authentication token found, using mock data');
                    return; // Keep using mock data if not authenticated
                }

                const res = await axios.get('/admin/users', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Only update state if we got valid data back
                if (res.data && Array.isArray(res.data.pending)) {
                    setPendingUsers(res.data.pending);
                    setApprovedUsers(res.data.approved);
                    setRejectedUsers(res.data.rejected);
                }
            } catch (error) {
                console.error('Failed to fetch users:', error);
                // Keep using mock data on error
            }
        };
        fetchUsers();
    }, []);

    // Fetch logs for admin section (example)
    useEffect(() => {
        const fetchLogs = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/admin/logs', {
            headers: { Authorization: token ? `Bearer ${token}` : '' }
            });
            setAccountLogs(res.data || []);
        } catch (error) {
            console.error('Failed to fetch logs:', error);
        }
        };
        fetchLogs();
    }, []);

    // Filter users based on search term
    const filterUsers = (users) => {
        if (!searchTerm) return users;
        return users.filter(user => 
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role.toLowerCase().includes(searchTerm.toLowerCase())
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

    // Approve user
    const handleApprove = async (userId) => {
        try {
        const token = localStorage.getItem('token');
        await axios.post(`/admin/users/${userId}/approve`, {}, {
            headers: { Authorization: token ? `Bearer ${token}` : '' }
        });
        setPendingUsers(prev => prev.filter(u => u.id !== userId));
        // Optionally, refetch users or move to approved
        } catch (error) {
        console.error('Failed to approve user:', error);
        }
    };

    // Reject user
    const handleReject = async (userId, reason = "Application did not meet requirements") => {
        try {
        const token = localStorage.getItem('token');
        await axios.post(`/admin/users/${userId}/reject`, { reason }, {
            headers: { Authorization: token ? `Bearer ${token}` : '' }
        });
        setPendingUsers(prev => prev.filter(u => u.id !== userId));
        // Optionally, refetch users or move to rejected
        } catch (error) {
        console.error('Failed to reject user:', error);
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
                    <DetailLabel>Role</DetailLabel>
                    <DetailValue>{selectedUser.role}</DetailValue>
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
            renderUserModal()
        )}
        </AppWrapper>
    );
};

export default Admin;