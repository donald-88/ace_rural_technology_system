// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
// import { getClientById } from "@/lib/actions/clients.actions";
// import { IntakeType } from "@/types";
// import { useEffect, useState } from "react";

// // Define the Client type
// interface Client {
//     id: string;
//     [key: string]: string | number | string[];
// }

// interface InventoryDetailsProps {
//     inventoryEntry: IntakeType;
// }

// const formatValue = (key: string, value: string | number | string[]) => {
//     switch (key) {
//         case 'price':
//             return `MKW ${value}`; // Format price with currency
//         case 'net_weight':
//             return `${value} kg`;
//         case 'gross_weight':
//             return `${value} kg`;
//         case 'deductions':
//             return `${value} g`;
//         case 'createdAt':
//             return new Date(value.toString()).toLocaleDateString();
//         default:
//             return value; // Default case for other entries
//     }
// };

// const formatKey = (key: string) => key.replace(/_/g, ' ');

// const InventoryDetails = ({ inventoryEntry }: InventoryDetailsProps) => {
//     const { bags, client_ids, ...otherEntries } = inventoryEntry;

//     const [clientDetails, setClientDetails] = useState<Client[]>([]);

//     useEffect(() => {
//         const fetchClientDetails = async () => {
//             try {
//                 const clients = await Promise.all(client_ids.map((id) => getClientById(id)));
//                 setClientDetails(clients);
//                 console.log('Client details:', clients);
//             } catch (error) {
//                 console.error('Error fetching client details:', error);
//             }
//         };

//         fetchClientDetails();
//     }, [client_ids]);

//     return (
//         <Accordion type="single" collapsible>
//             <AccordionItem value="item-1">
//                 <AccordionTrigger>Intake Details</AccordionTrigger>
//                 <AccordionContent>
//                     <div className="grid gap-4">
//                         <ul>
//                             {Object.keys(otherEntries).filter((key) => key !== 'client_ids').map((key) => (
//                                 <div key={key} className="flex justify-between items-center py-2">
//                                     <p className="capitalize">{formatKey(key)}</p>
//                                     <p className="text-black font-semibold">{formatValue(key, inventoryEntry[key as keyof IntakeType])}</p>
//                                 </div>
//                             ))}
//                         </ul>
//                     </div>
//                 </AccordionContent>
//             </AccordionItem>

//             <AccordionItem value="item-2">
//                 <AccordionTrigger>Holder Details</AccordionTrigger>
//                 <AccordionContent>
//                     {
//                         clientDetails.map((client, index) => (
//                             <div key={index} className="grid py-4 border-t border-gray-200">
//                                 <p className="text-md font-semibold">Client {index + 1}</p>
//                                 <ul>
//                                     {Object.keys(client).map((key) => (
//                                         <div key={key} className="flex justify-between items-center py-2">
//                                             <p className="capitalize">{formatKey(key)}</p>
//                                             <p className="text-black font-semibold">{formatValue(key, client[key])}</p>
//                                         </div>
//                                     ))}
//                                 </ul>
//                             </div>
//                         ))
//                     }
//                 </AccordionContent>
//             </AccordionItem>

//             <AccordionItem value="item-3">
//                 <AccordionTrigger>Bag Ids</AccordionTrigger>
//                 <AccordionContent>
//                     {
//                         bags.map((bag, index) => (
//                             <div key={index} className="flex justify-between items-center py-2">
//                                 <p className="capitalize">Bag {index + 1}</p>
//                                 <p className="text-black font-semibold">{bag}</p>
//                             </div>
//                         ))
//                     }
//                 </AccordionContent>
//             </AccordionItem>
//         </Accordion>
//     );
// }

// export default InventoryDetails;