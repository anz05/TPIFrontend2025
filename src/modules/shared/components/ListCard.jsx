// import AnimatedCard from "./AnimatedCard";
// import StructuredCard from "./StructuredCard";
// import ResponsiveText from "./ResponsiveText";
// import Button from "./Button";
// function ListCard({keyProp, openId, title, closedContent, openedContent}){

//     return(
//         <>
//             <AnimatedCard key={keyProp}>
//                     <StructuredCard
//                         key={keyProp}
//                         className="flex flex-row justify-between hover:bg-gray-50 items-center"
//                         title={title}
//                         content={
//                         <><ResponsiveText as='p'>{closedContent}</ResponsiveText>
//                         {{openId} == {keyProp} && (
//                             <div className='flex flex-wrap mt-2.5 pt-2 border-t-1 border-dashed'>
//                             <ResponsiveText as="ol" className='p-1'>
//                                 {openedContent}
//                             </ResponsiveText>
//                         </div>
//                         )}
//                     </>
//                     }
//                     actions={
//                     <>
//                         <Button onClick={() => handleClicked(keyProp)}>
//                         {!openId
//                             ? "Ver"
//                             : openId === keyProp
//                                 ? "Ocultar"
//                                 : "Ver"
//                         }
//                         </Button>
//                     </>
//                     }
//                     titleClassName={'font-semibold text-xl'}
//                     contentClassName={'text-xs'}
//                 ></StructuredCard>
//             </AnimatedCard>
//         </>
//     );
// }
// export default ListCard;
import AnimatedCard from "./AnimatedCard";
import StructuredCard from "./StructuredCard";
import ResponsiveText from "./ResponsiveText";
import Button from "./Button";

// Importamos handleClicked de las props
function ListCard({keyProp, openId, title, closedContent, openedContent, handleClicked}){ 

    const isOpen = openId === keyProp; // <-- Expresión correcta para verificar si está abierto

    return(
        <>
            <AnimatedCard key={keyProp}>
                <StructuredCard
                    key={keyProp}
                    className="flex flex-row justify-between hover:bg-gray-50 items-center p-4" 
                    titleClassName='font-semibold text-xl'
                    title={title}
                    
                    content={
                        <>
                            <ResponsiveText as='p' className="text-gray-700">
                                {closedContent}
                            </ResponsiveText>
                            
                            {isOpen && ( 
                                <div className='flex flex-col mt-2.5 pt-2 border-t border-gray-300'>
                                    <ResponsiveText as="ol" className='space-y-1'>
                                        {openedContent}
                                    </ResponsiveText>
                                </div>
                            )}
                        </>
                    }
                    actions={
                        <>
                            <Button 
                                onClick={() => handleClicked(keyProp)}
                            >
                                {isOpen ? "Ocultar" : "Ver"} 
                            </Button>
                        </>
                    }
                />
            </AnimatedCard>
        </>
    );
}
export default ListCard;