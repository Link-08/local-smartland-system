import React, { useState, useEffect } from 'react';
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

const Admin = () => {
    const { user, loading: authLoading } = useAuth();
    const [activeTab, setActiveTab] = useState("pending");
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [accountLogs, setAccountLogs] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [summary, setSummary] = useState({ pending: 0, active: 0, inactive: 0 });

    // Fetch users based on active tab
    useEffect(() => {
        const fetchUsers = async () => {
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

                setLoading(true);
                const status = activeTab === 'pending' ? 'pending' : 
                               activeTab === 'approved' ? 'active' : 'pending';
                
                const res = await api.get('/api/admin/users', {
                    params: {
                        status,
                        page: currentPage,
                        limit: 10
                    }
                });

                if (res.data && Array.isArray(res.data.users)) {
                    setUsers(res.data.users);
                    setTotalPages(res.data.totalPages || 1);
                    setTotalUsers(res.data.users.filter(u => u.role !== 'admin').length);
                } else {
                    console.error('Invalid response format:', res.data);
                    setUsers([]);
                    setTotalPages(1);
                    setTotalUsers(0);
                }
                setError(null);
            } catch (error) {
                console.error('Failed to fetch users:', error.response?.data || error.message);
                if (error.response?.status === 401) {
                    setError('Session expired. Please log in again.');
                    localStorage.removeItem('token');
                } else if (error.response?.status === 403) {
                    setError('Access denied: Admin privileges required');
                } else {
                    setError(error.response?.data?.error || 'Failed to fetch users');
                }
                setUsers([]);
                setTotalPages(1);
                setTotalUsers(0);
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading && user) {
            fetchUsers();
        }
    }, [user, authLoading, activeTab, currentPage]);

    // Fetch summary counts
    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const res = await api.get('/api/admin/users/summary');
                setSummary(res.data);
            } catch (e) {
                setSummary({ pending: 0, active: 0, inactive: 0 });
            }
        };
        fetchSummary();
    }, [users]);

    // Filter users based on search term
    const filterUsers = (users) => {
        if (!Array.isArray(users)) return [];
        if (!searchTerm) return users;
        return users.filter(user => 
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    // Get current users based on active tab
    const getCurrentUsers = () => {
        let filtered = filterUsers(users);
        // Hide admin accounts in Active Users tab
        if (activeTab === 'approved') {
            filtered = filtered.filter(user => user.role !== 'admin');
        }
        return filtered;
    };

    // Handle page change
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    // Approve user
    const approveUser = async (userId) => {
        try {
            const res = await api.put(`/api/admin/users/${userId}/approve`);
            setUsers(users.map(user => 
                user.id === userId ? { ...user, isActive: true } : user
            ));
            alert('User approved successfully!');
        } catch (error) {
            console.error('Error approving user:', error);
            alert('Failed to approve user');
        }
    };

    // Reject user
    const rejectUser = async (userId) => {
        try {
            const res = await api.put(`/api/admin/users/${userId}/reject`);
            setUsers(users.map(user => 
                user.id === userId ? { ...user, isActive: false } : user
            ));
            alert('User rejected successfully!');
        } catch (error) {
            console.error('Error rejecting user:', error);
            alert('Failed to reject user');
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
                    <DetailValue>{(selectedUser.firstName || '') + ' ' + (selectedUser.lastName || '')}</DetailValue>
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
                    <DetailValue>{selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : '-'}</DetailValue>
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
                    <RejectButton onClick={() => rejectUser(selectedUser.id)}>
                    Reject
                    </RejectButton>
                    <ApproveButton onClick={() => approveUser(selectedUser.id)}>
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

    if (!user || user.role !== 'admin') {
        return <div>Access denied: Admin privileges required</div>;
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const filteredUsers = getCurrentUsers();

    return (
        <AppWrapper>
        <GlobalStyle />
        
        {/* Admin Dashboard */}
        <AdminContainer>
            <AdminHeader>
                    <AdminTitle>User Management</AdminTitle>
            <AdminStats>
                <StatCard>
                    <StatNumber>{summary.pending}</StatNumber>
                    <StatLabel>Pending Verification</StatLabel>
                </StatCard>
                <StatCard>
                    <StatNumber>{summary.active}</StatNumber>
                    <StatLabel>Active Users</StatLabel>
                </StatCard>
                <StatCard>
                    <StatNumber>{summary.inactive}</StatNumber>
                    <StatLabel>Inactive Users</StatLabel>
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
                        Active Users
            </Tab>
            <Tab 
                selected={activeTab === "rejected"} 
                onClick={() => setActiveTab("rejected")}
            >
                        Inactive Users
            </Tab>
            </TabContainer>

            <SearchInput 
            type="text" 
                    placeholder="Search by email or role..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            />

            <UsersList>
            <UsersTable>
                <thead>
                <tr>
                                <TableHeader>Email</TableHeader>
                                <TableHeader>Role</TableHeader>
                                <TableHeader>Status</TableHeader>
                    <TableHeader>Registration Date</TableHeader>
                    <TableHeader>Actions</TableHeader>
                </tr>
                </thead>
                <tbody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map(user => (
                    <TableRow key={user.id}>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.role}</TableCell>
                                        <TableCell>{user.isActive ? 'Active' : 'Inactive'}</TableCell>
                                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                        <ViewButton onClick={() => handleViewUser(user)}>
                            View Details
                        </ViewButton>
                        
                                            {!user.isActive && (
                            <ApproveButton onClick={() => approveUser(user.id)}>
                                                    Activate
                            </ApproveButton>
                                            )}
                                            
                                            {user.isActive && (
                            <RejectButton onClick={() => rejectUser(user.id)}>
                                                    Deactivate
                            </RejectButton>
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

                {/* Pagination */}
                {totalPages > 1 && (
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        marginTop: '20px',
                        gap: '10px'
                    }}>
                        <button 
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: currentPage === 1 ? '#ccc' : '#3498db',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                            }}
                        >
                            Previous
                        </button>
                        <span style={{ 
                            padding: '8px 16px',
                            backgroundColor: '#34495E',
                            color: 'white',
                            borderRadius: '4px'
                        }}>
                            Page {currentPage} of {totalPages}
                        </span>
                        <button 
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: currentPage === totalPages ? '#ccc' : '#3498db',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                            }}
                        >
                            Next
                        </button>
                    </div>
                )}
        </AdminContainer>

        {/* User Detail Modal */}
        {showModal && selectedUser && (
            renderUserModal()
        )}
        </AppWrapper>
    );
};

export default Admin;