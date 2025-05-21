import React, { useState, useEffect, useContext } from 'react';
import api from '../config/axios';
import { useAuth } from '../contexts/AuthContext';
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
import { mockUsers } from '../data/mockUsers';

const Admin = () => {
    const { user, loading: authLoading } = useAuth();
    const [activeTab, setActiveTab] = useState("pending");
    const [pendingUsers, setPendingUsers] = useState([]);
    const [approvedUsers, setApprovedUsers] = useState([]);
    const [rejectedUsers, setRejectedUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [accountLogs, setAccountLogs] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch logs for admin section
    useEffect(() => {
        const fetchLogs = async () => {
            try {
                if (!user) {
                    console.error('No user found in context');
                    setError('Please log in to access this page');
                    return;
                }

                if (user.role !== 'admin') {
                    console.error('User is not an admin:', user.role);
                    setError('Access denied: Admin privileges required');
                    return;
                }

                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('No token found in localStorage');
                    setError('Please log in to access this page');
                    return;
                }

                console.log('Fetching logs for admin:', { 
                    id: user.id, 
                    email: user.email, 
                    role: user.role,
                    token: token.substring(0, 10) + '...' // Log only first 10 chars of token
                });

                const res = await api.get('/api/admin/logs');
                console.log('Logs response:', res.data);
                setAccountLogs(res.data || []);
            } catch (error) {
                console.error('Failed to fetch logs:', error.response?.data || error.message);
                if (error.response?.status === 401) {
                    setError('Session expired. Please log in again.');
                    localStorage.removeItem('token'); // Clear invalid token
                } else if (error.response?.status === 403) {
                    setError('Access denied: Admin privileges required');
                } else {
                    setError(error.response?.data?.error || 'Failed to fetch logs');
                }
                setAccountLogs([]);
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading && user) {
            fetchLogs();
        }
    }, [user, authLoading]);

    // Inject mock users for local development (only buyers and sellers)
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            setPendingUsers(mockUsers.pending.filter(u => u.role === 'buyer' || u.role === 'seller'));
            setApprovedUsers(mockUsers.approved.filter(u => u.role === 'buyer' || u.role === 'seller'));
            setRejectedUsers(mockUsers.rejected.filter(u => u.role === 'buyer' || u.role === 'seller'));
            setLoading(false);
        }
    }, []);

    // Filter users based on search term
    const filterUsers = (users) => {
        if (!searchTerm) return users;
        return users.filter(user => 
            user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role?.toLowerCase().includes(searchTerm.toLowerCase())
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
            console.log('Approving user:', userId);
            const res = await api.post(`/api/admin/users/${userId}/approve`);
            console.log('Approve response:', res.data);
            
            // Update local state
            setPendingUsers(prev => prev.filter(u => u.id !== userId));
            setApprovedUsers(prev => [res.data.user, ...prev]);
            
            alert('User approved successfully');
        } catch (error) {
            console.error('Failed to approve user:', error);
            alert('Failed to approve user. Please try again.');
        }
    };

    // Reject user
    const handleReject = async (userId, reason = "Application did not meet requirements") => {
        try {
            console.log('Rejecting user:', userId);
            const res = await api.post(`/api/admin/users/${userId}/reject`, { reason });
            console.log('Reject response:', res.data);
            
            // Update local state
            setPendingUsers(prev => prev.filter(u => u.id !== userId));
            setRejectedUsers(prev => [res.data.user, ...prev]);
            
            alert('User rejected successfully');
        } catch (error) {
            console.error('Failed to reject user:', error);
            alert('Failed to reject user. Please try again.');
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

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!user || user.role !== 'admin') {
        return <div>Access denied: Admin privileges required</div>;
    }

    return (
        <AppWrapper>
        <GlobalStyle />
        
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