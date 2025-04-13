import React, { useState } from 'react';
import styled from 'styled-components';
import { FaShoppingCart, FaSearch } from 'react-icons/fa';

const MedicineStyled = styled.div`
    padding: 2rem;
    background: #f8f9fa;
    min-height: 100vh;

    .medicine-container {
        max-width: 1200px;
        margin: 0 auto;
        background: white;
        border-radius: 15px;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        padding: 2rem;
    }

    .search-bar {
        display: flex;
        margin-bottom: 2rem;
        gap: 1rem;

        input {
            flex: 1;
            padding: 0.8rem 1rem;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 1rem;
            outline: none;
            transition: border-color 0.3s;

            &:focus {
                border-color: #4CAF50;
            }
        }

        button {
            padding: 0.8rem 1.5rem;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transition: background 0.3s;

            &:hover {
                background: #45a049;
            }
        }
    }

    .medicine-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 2rem;
    }

    .medicine-card {
        background: white;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        padding: 1.5rem;
        transition: transform 0.3s;

        &:hover {
            transform: translateY(-5px);
        }

        h3 {
            color: #333;
            margin-bottom: 1rem;
        }

        .price {
            color: #4CAF50;
            font-size: 1.2rem;
            font-weight: bold;
            margin: 1rem 0;
        }

        .description {
            color: #666;
            margin-bottom: 1rem;
            font-size: 0.9rem;
        }

        button {
            width: 100%;
            padding: 0.8rem;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            transition: background 0.3s;

            &:hover {
                background: #45a049;
            }
        }
    }
`;

const mockMedicines = [
    {
        id: 1,
        name: "Paracetamol 500mg",
        price: "₹50",
        description: "For fever and pain relief. Take 1 tablet every 4-6 hours as needed.",
        image: "https://via.placeholder.com/150"
    },
    {
        id: 2,
        name: "Cetirizine 10mg",
        price: "₹30",
        description: "For allergy relief. Take 1 tablet daily.",
        image: "https://via.placeholder.com/150"
    },
    {
        id: 3,
        name: "Omeprazole 20mg",
        price: "₹80",
        description: "For acid reflux. Take 1 capsule daily before breakfast.",
        image: "https://via.placeholder.com/150"
    },
    {
        id: 4,
        name: "Vitamin C 500mg",
        price: "₹120",
        description: "Immune support. Take 1 tablet daily with meals.",
        image: "https://via.placeholder.com/150"
    }
];

function Medicine() {
    const [searchTerm, setSearchTerm] = useState('');
    const [medicines, setMedicines] = useState(mockMedicines);

    const handleSearch = () => {
        const filtered = mockMedicines.filter(medicine =>
            medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            medicine.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setMedicines(filtered);
    };

    const handleBuy = (medicineId) => {
        // Implement buy functionality
        alert(`Added medicine ${medicineId} to cart`);
    };

    return (
        <MedicineStyled>
            <div className="medicine-container">
                <h2>Medicines</h2>
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search medicines..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button onClick={handleSearch}>
                        <FaSearch /> Search
                    </button>
                </div>
                <div className="medicine-grid">
                    {medicines.map(medicine => (
                        <div key={medicine.id} className="medicine-card">
                            <img src={medicine.image} alt={medicine.name} />
                            <h3>{medicine.name}</h3>
                            <div className="price">{medicine.price}</div>
                            <div className="description">{medicine.description}</div>
                            <button onClick={() => handleBuy(medicine.id)}>
                                <FaShoppingCart /> Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </MedicineStyled>
    );
}

export default Medicine; 