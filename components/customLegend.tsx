import React from 'react';

interface CustomLegendProps {
    commodity: string;
    quantity: string;
    color: string;
}

const CustomLegend: React.FC<CustomLegendProps> = ({ commodity, quantity, color }) => {
    return (
        <div className="flex w-full gap-4 justify-center items-center">
            <div className="flex gap-3 items-center w-1/3">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                <p>{commodity}</p>
            </div>
            <div className="flex justify-end w-1/3">
                <p>{quantity}</p>
            </div>
        </div>
    );
};

export default CustomLegend;