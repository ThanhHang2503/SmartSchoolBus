"use client"
import React from 'react';
import {
	Drawer,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Box,
	Divider,
	Typography,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
// import RecentActorsIcon from '@mui/icons-material/RecentActors';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import CastForEducationIcon from '@mui/icons-material/CastForEducation';
// import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import LogoutIcon from '@mui/icons-material/Logout';
import Link from 'next/link';
import {useRouter, usePathname} from 'next/navigation';

const menuItems = [
	{text: "Tổng quan", icon: <HomeIcon />, path: "/driver"},
	// {text: "DS học sinh", icon: <RecentActorsIcon />, path: "/driver/students"},
	{text: "Lịch trình", icon: <CastForEducationIcon />, path: "/driver/schedule"},
	{text: "Hành trình", icon: <LocationPinIcon />, path: "/driver/map"},
	// {text: "Cảnh báo", icon: <NotificationImportantIcon />, path: "/driver/alert"},
];


export default function DriverSidebar() {
	const router = useRouter();
	const pathname = usePathname();

	// logout
	const handleLogout = () => {
		localStorage.removeItem("token");
		router.push("/login");
	};

	return (
		<Drawer
			variant="permanent"
			sx={{
				width: 200,
				flexShrink: 0,
				['& .MuiDrawer-paper']: {
					width: 200,
					backgroundColor: "#B8E7FF",
					color: "black",
					boxSizing: "border-box",
					position: "relative",
					// border: "2px solid black",
				},
			}}
		>
			<Box sx={{ overflow: "auto", display: "flex", flexDirection: "column", height: "100%"}}>
				{/* Menu chính */}
				<List disablePadding>
					{menuItems.map((item) => {
						const active = pathname === item.path;

						return (
							<ListItem key={item.text} disablePadding>
								<ListItemButton
								component={Link}
								href={item.path}
								sx={{backgroundColor: active ? "#82d3f3ff" : "transparent",
									'$: hover': {backgroundColor: "#4dd0e1"},
								}}
								>
									<ListItemIcon sx={{color: "black", minWidth: 40}}>{item.icon}</ListItemIcon>
									<ListItemText 
										primary={
											<Typography fontSize={14} fontWeight={active ? 700 : 500}>{item.text}</Typography>
										}
									/>
								</ListItemButton>
							</ListItem>
						);
					})}	
        		</List>
						
				{/* <Box sx={{ flexGrow: 1}} /> Đẩy nút đăng xuất xuống cuối */}
				{/* Nút đăng xuất */}
				<Divider />
				<List>
					<ListItem disablePadding>
						<ListItemButton onClick={handleLogout}>
							<ListItemIcon sx={{ color: "black", minWIdth: 40}}>
								<LogoutIcon />
							</ListItemIcon>
							<ListItemText
								primary={
    								<Typography fontSize={14} >Đăng xuất</Typography>
  								}
							/>
						</ListItemButton>
					</ListItem>
				</List>
			</Box>
		</Drawer>
	);
}