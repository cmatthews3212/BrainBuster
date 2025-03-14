import decode from 'jwt-decode';

class AuthService {
  getProfile() {
    const token = this.getToken();

    if (!token) {
      return null;
    }

    try {
      return decode(token);
    } catch (err) {
      console.error('Failed to decode token:', err);
      return null;
    }
  }

  loggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      return decoded.exp < Date.now() / 1000;
    } catch (err) {
      return false;
    }
  }

  getToken() {
    // Retrieves the user token from localStorage
    return typeof window !== 'undefined' ? localStorage.getItem('id_token') : null;
  }

  login(idToken) {
    // Saves user token to localStorage
    localStorage.setItem('id_token', idToken);

    
      window.location.assign('/dashboard')
    
  }

  logout() {
    // Clear user token and profile data from localStorage
    localStorage.removeItem('id_token');
    // this will reload the page and reset the state of the application
    window.location.assign('/');
  }
}

export default new AuthService();
