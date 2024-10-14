interface CustomLegendProps {
    commodity: string
    quantity: string
    weight: string
}

const CustomLegend = ({ commodity, quantity, weight }: CustomLegendProps) => {
    return (
        <div className="flex w-full gap-4 justify-center items-center">
            <div className="flex gap-2 items-center w-1/4">
                <div className="h-3 w-1.5 rounded-sm bg-[#459428]" />
                <p className="text-sm text-secondary">{commodity}</p>
            </div>
            <div className="flex justify-center w-1/4">
                <p className="text-sm text-secondary">{quantity}</p>
            </div>
            <div className="flex justify-end w-1/4">
                <p className="text-sm text-secondary">{weight}</p>
            </div>
        </div>
    )
}

export default CustomLegend