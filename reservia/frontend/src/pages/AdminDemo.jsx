import Dashboard from './admin/Dashboard'

export default function AdminDemo() {
    // Cette page réutilise simplement le Dashboard mais sans les protections de route
    // pour permettre une visualisation facile par le client
    return <Dashboard />
}
