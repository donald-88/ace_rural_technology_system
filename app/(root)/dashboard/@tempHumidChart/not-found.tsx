export default function TempHumidNotFound() {
    return (
      <div className="p-4 bg-amber-50 rounded-md border border-amber-200">
        <h3 className="text-amber-600 text-sm font-medium">Temperature/Humidity Chart Not Found</h3>
        <p className="text-xs text-gray-600 mt-1">Check route configuration</p>
      </div>
    );
  }