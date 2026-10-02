import { createContext, useContext, useEffect, useState } from 'react';

export const CaptainDataContext = createContext();

export const CaptainContext = ({ children }) => {
	const [captain, setCaptain] = useState(() => {
		try {
			const storedCaptain = localStorage.getItem('captain');
			return storedCaptain ? JSON.parse(storedCaptain) : null;
		} catch {
			return null;
		}
	});

	const [captainToken, setCaptainToken] = useState(
		() => localStorage.getItem('captainToken') || null
	);

    const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		if (captain) {
			localStorage.setItem('captain', JSON.stringify(captain));
		} else {
			localStorage.removeItem('captain');
		}
	}, [captain]);

	useEffect(() => {
		if (captainToken) {
			localStorage.setItem('captainToken', captainToken);
		} else {
			localStorage.removeItem('captainToken');
		}
	}, [captainToken]);

	const loginCaptain = (captainData, token) => {
		setCaptain(captainData);
		if (token) setCaptainToken(token);
	};

	const logoutCaptain = () => {
		setCaptain(null);
		setCaptainToken(null);
	};

	return (
		<CaptainDataContext.Provider
			value={{
				captain,
				setCaptain,
				captainToken,
				setCaptainToken,
				loginCaptain,
				logoutCaptain,
				isCaptainAuthenticated: Boolean(captainToken),
			}}
		>
			{children}
		</CaptainDataContext.Provider>
	);
};

export const useCaptain = () => {
	const context = useContext(CaptainContext);

	if (!context) {
		throw new Error('useCaptain must be used within a CaptainProvider');
	}

	return context;
};

export default CaptainContext;
