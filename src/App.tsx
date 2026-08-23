import { NavLink } from 'react-router-dom'
import { Button } from './components/ui/button'

function App() {
	return (
		<>
			<NavLink to="/spectator">
				<Button variant="default">Przejdz do widoku obserwatora</Button>
			</NavLink>
		</>
	)
}

export default App
