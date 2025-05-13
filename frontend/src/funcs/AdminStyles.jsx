// AdminStyles.js
import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
	* {
		box-sizing: border-box;
	}

	html, body {
		margin: 0;
		padding: 0;
		width: 100%;
		height: 100%;
		font-family: 'Arial', sans-serif;
		background-color: #2C3E50;
		color: #ecf0f1;
	}

	#root {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}
`;

export const AppWrapper = styled.div`
	width: 100%;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	background-color: #2C3E50;
`;

export const AdminContainer = styled.div`
	width: 100%;
	flex: 1;
	padding: 24px;
	background-color: #2C3E50;
	color: #ecf0f1;
	overflow-x: hidden;
`;

export const AdminHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24px;
`;

export const AdminTitle = styled.h1`
	font-size: 24px;
	font-weight: bold;
	color: #ecf0f1;
	margin: 0;
`;

export const AdminStats = styled.div`
	display: flex;
	gap: 16px;
`;

export const StatCard = styled.div`
	background-color: #34495E;
	padding: 16px;
	border-radius: 8px;
	width: 120px;
	text-align: center;
`;

export const StatNumber = styled.div`
	font-size: 32px;
	font-weight: bold;
	color: #ecf0f1;
`;

export const StatLabel = styled.div`
	font-size: 14px;
	color: #bdc3c7;
	margin-top: 4px;
`;

export const TabContainer = styled.div`
	display: flex;
	margin-bottom: 24px;
	border-bottom: 1px solid #34495E;
`;

export const Tab = styled.button`
	padding: 12px 20px;
	background-color: ${props => props.selected ? '#34495E' : 'transparent'};
	border: none;
	border-bottom: ${props => props.selected ? '2px solid #3498db' : '2px solid transparent'};
	color: ${props => props.selected ? '#ecf0f1' : '#bdc3c7'};
	font-weight: ${props => props.selected ? '600' : '400'};
	cursor: pointer;
	transition: all 0.2s ease;

	&:hover {
		background-color: #34495E;
	}
`;

export const SearchInput = styled.input`
	width: 100%;
	padding: 12px 16px;
	border-radius: 8px;
	border: 1px solid #34495E;
	background-color: #34495E;
	color: #ecf0f1;
	font-size: 16px;
	margin-bottom: 24px;

	&::placeholder {
		color: #7f8c8d;
	}

	&:focus {
		outline: none;
		border-color: #3498db;
	}
`;

export const UsersList = styled.div`
	width: 100%;
	overflow-x: auto;
`;

export const UsersTable = styled.table`
	width: 100%;
	min-width: 800px;
	border-collapse: collapse;
`;

export const TableHeader = styled.th`
	text-align: left;
	padding: 16px;
	background-color: #34495E;
	color: #ecf0f1;
	font-weight: 600;
	border-bottom: 1px solid #2C3E50;
`;

export const TableRow = styled.tr`
	border-bottom: 1px solid #34495E;

	&:hover {
		background-color: #34495E;
	}
`;

export const TableCell = styled.td`
	padding: 16px;
	color: #ecf0f1;
`;

export const ViewButton = styled.button`
	background-color: #3498db;
	color: white;
	border: none;
	border-radius: 4px;
	padding: 8px 12px;
	cursor: pointer;
	font-size: 14px;
	margin-right: 8px;

	&:hover {
		background-color: #2980b9;
	}
`;

export const ApproveButton = styled.button`
	background-color: #2ecc71;
	color: white;
	border: none;
	border-radius: 4px;
	padding: 8px 12px;
	cursor: pointer;
	font-size: 14px;
	margin-right: 8px;

	&:hover {
		background-color: #27ae60;
	}
`;

export const RejectButton = styled.button`
	background-color: #e74c3c;
	color: white;
	border: none;
	border-radius: 4px;
	padding: 8px 12px;
	cursor: pointer;
	font-size: 14px;

	&:hover {
		background-color: #c0392b;
	}
`;

export const UserImage = styled.img`
	width: 40px;
	height: 40px;
	border-radius: 50%;
	object-fit: cover;
`;

export const ModalOverlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.7);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 1000;
`;

export const ModalContent = styled.div`
	background-color: #34495E;
	border-radius: 8px;
	width: 800px;
	max-width: 90%;
	max-height: 90vh;
	overflow-y: auto;
	padding: 24px;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
	color: #ecf0f1;
`;

export const ModalHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16px;
`;

export const ModalTitle = styled.h2`
	font-size: 1.5rem;
	margin: 0;
	color: #ecf0f1;
`;

export const CloseButton = styled.button`
	background: none;
	border: none;
	font-size: 1.5rem;
	cursor: pointer;
	color: #ecf0f1;
`;

export const UserDetailGrid = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 16px;
	margin-bottom: 24px;
`;

export const DetailColumn = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
`;

export const DetailItem = styled.div`
	margin-bottom: 8px;
`;

export const DetailLabel = styled.div`
	font-size: 0.85rem;
	color: #bdc3c7;
	margin-bottom: 4px;
`;

export const DetailValue = styled.div`
	font-size: 1rem;
	color: #ecf0f1;
`;

export const ImageContainer = styled.div`
	margin-bottom: 16px;
`;

export const ImageLabel = styled.div`
	font-size: 0.9rem;
	font-weight: 500;
	margin-bottom: 8px;
	color: #ecf0f1;
`;

export const IDImage = styled.img`
	width: 100%;
	border-radius: 4px;
	border: 1px solid #2C3E50;
`;

export const ModalActions = styled.div`
	display: flex;
	justify-content: flex-end;
	gap: 12px;
	margin-top: 24px;
`;

export const NavContainer = styled.nav`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 24px;
	height: 80px;
	background-color: #2C3E50;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	width: 100%;
	flex-shrink: 0;
`;

export const Logo = styled.div`
	display: flex;
	flex-direction: column;
`;

export const Smartland = styled.span`
	font-size: 24px;
	font-weight: bold;
	color: #ecf0f1;
`;

export const System = styled.span`
	font-size: 12px;
	color: #bdc3c7;
`;

export const NavLinks = styled.div`
	display: flex;
	gap: 24px;
`;

export const NavItem = styled.a`
	color: #ecf0f1;
	font-size: 16px;
	font-weight: 500;
	text-decoration: none;
	cursor: pointer;
	padding: 8px 12px;
	border-radius: 4px;

	&:hover {
		background-color: #34495E;
	}
`;

export const ProfileSection = styled.div`
	display: flex;
	align-items: center;
`;

export const Avatar = styled.img`
	width: 40px;
	height: 40px;
	border-radius: 50%;
	cursor: pointer;
`;