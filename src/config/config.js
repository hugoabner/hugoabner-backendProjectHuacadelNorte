// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @next/next/no-img-element */
// "use client";

// import React, { useEffect, useState } from "react";
// import { getProyects } from "../../utils/ApiCalls"; // Ajusta la ruta según la ubicación de tu archivo
// import { Checkbox, Table } from "@mantine/core";

// const ProyectsList = () => {
//   const [proyects, setProyects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedRows, setSelectedRows] = useState<number[]>([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const data = await getProyects();
//         setProyects(data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error loading projects:", error);
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   if (loading) {
//     return <p>cargando.....</p>;
//   }


//   const rows = proyects.map((element: any) => (
//     <Table.Tr
//       key={element.id}
//       bg={selectedRows.includes(element.position) ? 'var(--mantine-color-blue-light)' : undefined}
//     >
//       <Table.Td>
//         <Checkbox
//           aria-label="Select row"
//           checked={selectedRows.includes(element.position)}
//           onChange={(event) =>
//             setSelectedRows(
//               event.currentTarget.checked
//                 ? [...selectedRows, element.position]
//                 : selectedRows.filter((position) => position !== element.position)
//             )
//           }
//         />
//       </Table.Td>
//       <Table.Td>{element.name}</Table.Td>
//       <Table.Td>{element.description}</Table.Td>
//       <Table.Td>{element.createdAt}</Table.Td>
//       <Table.Td>{element.category}</Table.Td>
//       <img src={element.imgURL}  className="w-20 h-20 py-2 rounded-xl" alt="" />
//     </Table.Tr>
//   ));

//   return (

//     <Table striped highlightOnHover withTableBorder withColumnBorders>
//       <Table.Thead>
//         <Table.Tr>
//           <Table.Th>{}</Table.Th>
//           <Table.Th>Proyectos</Table.Th>
//           <Table.Th>Descripción</Table.Th>
//           <Table.Th>Fecha de Creación</Table.Th>
//           <Table.Th>Categoria</Table.Th>
//           <Table.Th>Imagen</Table.Th>
//         </Table.Tr>
//       </Table.Thead>

//       <Table.Tbody>{rows}</Table.Tbody>
//   </Table>
//   );
// };

// export default ProyectsList;