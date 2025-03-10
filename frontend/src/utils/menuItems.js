import { FaHome, FaStethoscope, FaBrain, FaUserMd, FaHospital } from 'react-icons/fa';

export const menuItems = [
    {
        id: 1,
        title: 'Home',
        icon: <FaHome />,
        link: ''
    },
    {
        id: 2,
        title: 'Symptom Analysis',
        icon: <FaStethoscope />,
        link: 'symptom-analysis'
    },
    {
        id: 3,
        title: 'Mental Wellness',
        icon: <FaBrain />,
        link: 'mental-wellness'
    },
    {
        id: 4,
        title: 'Consult Doctor',
        icon: <FaUserMd />,
        link: 'consult-doctor'
    },
    {
        id: 5,
        title: 'Nearby Hospitals',
        icon: <FaHospital />,
        link: 'nearby-hospitals'
    }
];