// client/src/pages/PedidosYApartados.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as api from '../service/api';
import { FaClipboardList, FaFilter, FaPlus, FaSearch, FaArrowLeft, FaBoxOpen, FaTimes } from 'react-icons/fa';
import { loadCajaSession } from '../utils/caja';

// --- ESTILOS ---
const PageWrapper = styled.div`padding:2rem 4rem; background:#f8f9fa; min-height:100vh; @media(max-width:768px){padding:1rem;}`;
const HeaderContainer = styled.div`display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem; flex-wrap:wrap; gap:1rem;`;
const Title = styled.h1`font-size:2.5rem; color:#343a40; display:flex; align-items:center; gap:1rem; @media(max-width:768px){font-size:1.8rem;}`;
const Button = styled.button`
padding:0.7rem 1.3rem; border:none;
background-color:${props=>props.$primary?'#28a745':'#007bff'};
color:white; border-radius:8px; cursor:pointer; font-weight:bold;
display:inline-flex; align-items:center; gap:0.5rem;
transition:0.2s;
&:hover:not(:disabled){opacity:0.85;}
&:disabled{opacity:0.5; cursor:not-allowed;}
`;
const BackButton = styled(Link)`padding:0.7rem 1.3rem; background:#6c757d; color:white; border-radius:8px; font-weight:bold; display:inline-flex; align-items:center; gap:0.5rem; text-decoration:none; transition:0.2s; &:hover{background:#5a6268;}`;
const ContentGrid = styled.div`display:grid; grid-template-columns:300px 1fr; gap:2rem; @media(max-width:992px){grid-template-columns:1fr;}`;
const FilterPanel = styled.aside`background:white; padding:1.5rem; border-radius:8px; box-shadow:0 2px 10px rgba(0,0,0,0.05); align-self:flex-start; display:flex; flex-direction:column; gap:1.5rem;`;
const Input = styled.input`width:100%; padding:0.8rem; font-size:1rem; border-radius:8px; border:1px solid #ccc;`;
const Select = styled.select`width:100%; padding:0.8rem; font-size:1rem; border-radius:8px; border:1px solid #ccc;`;
const PedidoCard = styled.div`
background:white; border-radius:8px; box-shadow:0 2px 10px rgba(0,0,0,0.05);
border-left:5px solid ${props=>{switch(props.estado){case'APARTADO':return'#ffc107'; case'COMPLETADO':return'#28a745'; case'CANCELADO':return'#dc3545'; default:return'#6c757d';}}};
display:flex; flex-direction:column; transition:all 0.2s ease-in-out;
&:hover{transform:translateY(-3px); box-shadow:0 4px 15px rgba(0,0,0,0.1);}
`;
const CardBody = styled.div`padding:1.5rem; cursor:pointer;`;
const CardFooter = styled.div`padding:1rem 1.5rem; background:#f8f9fa; border-top:1px solid #e9ecef;`;
const ProgressBar = styled.div`background:#e9ecef; border-radius:5px; height:10px; overflow:hidden; div{width:${props=>props.percent}%; background:#28a745; height:100%; transition:0.5s;}`;
const EmptyState = styled.div`text-align:center; padding:4rem; background:white; border-radius:8px; color:#6c757d; border:2px dashed #e0e0e0; svg{font-size:3rem; margin-bottom:1rem; opacity:0.5;} p{font-size:1.2rem;}`;

// --- MODAL ---
const ModalOverlay = styled.div`position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); display:flex; justify-content:center; align-items:center; z-index:1000;`;
const ModalContent = styled.div`background:#fff; border-radius:10px; width:90%; max-width:800px; max-height:90vh; overflow-y:auto; padding:2rem; position:relative; @media(max-width:768px){padding:1rem;}`;
const CloseButton = styled.button`position:absolute; top:1rem; right:1rem; border:none; background:transparent; font-size:1.5rem; cursor:pointer;`;
const Section = styled.div`margin-bottom:1.5rem;`;
const ProductList = styled.div`display:flex; flex-direction:column; gap:0.5rem; max-height:200px; overflow-y:auto; margin-top:0.5rem;`;
const ProductItem = styled.div`display:flex; justify-content:space-between; align-items:center; padding:0.5rem; border:1px solid #ccc; border-radius:6px; cursor:pointer; &:hover{background:#f1f1f1;}`;
const OrderTable = styled.table`width:100%; border-collapse:collapse; margin-top:1rem; th, td{padding:0.5rem; text-align:left; border-bottom:1px solid #ddd;}`;
const ClientList = styled.div`display:flex; flex-direction:column; max-height:150px; overflow-y:auto; margin-top:0.5rem; border:1px solid #ccc; border-radius:6px;`;

const PedidosYApartados = () => {
    const { user } = useAuth();
    const token = localStorage.getItem('token');
    const [pedidos, setPedidos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filtroEstado, setFiltroEstado] = useState('Activos');
    const [searchTerm, setSearchTerm] = useState('');
    const [modal, setModal] = useState({name:null, props:{}});
    
    // Modal crear pedido
    const [orderSearch,setOrderSearch]=useState('');
    const [products,setProducts]=useState([]);
    const [loadingProducts,setLoadingProducts]=useState(false);
    const [selectedProducts,setSelectedProducts]=useState([]);
    const [clienteSearch,setClienteSearch]=useState('');
    const [clients,setClients]=useState([]);
    const [clienteId,setClienteId]=useState(null);

    const openModal=useCallback((name,props={})=>setModal({name,props}),[]);
    const closeModal=useCallback(()=>setModal({name:null,props:{}}),[]);
    const showAlert=useCallback((props)=>openModal('alert',props),[openModal]);

    const isCajaOpen=useMemo(()=>{
        if(!user) return false;
        const session=loadCajaSession(user.id_usuario||user.id);
        return session && !session.closedAt;
    },[user]);

    const fetchPedidos=useCallback(async()=>{
        if(!token){ setIsLoading(false); return; }
        setIsLoading(true);
        try{
            const data=await api.fetchOrders(token);
            setPedidos(data);
        }catch(error){ showAlert({title:"Error", message:error.message});}
        finally{setIsLoading(false);}
    },[token,showAlert]);

    useEffect(()=>{fetchPedidos();},[fetchPedidos]);

    const pedidosFiltrados=useMemo(()=>{
        let filtered=Array.isArray(pedidos)?pedidos:[];
        if(filtroEstado==='Activos'){ filtered=filtered.filter(p=>p.estado==='APARTADO'||p.estado==='PENDIENTE');}
        else if(filtroEstado!=='Todos'){ filtered=filtered.filter(p=>p.estado===filtroEstado.toUpperCase());}
        if(searchTerm){
            const lower=searchTerm.toLowerCase();
            filtered=filtered.filter(p=>(p.clienteNombre && p.clienteNombre.toLowerCase().includes(lower))||String(p.id).includes(lower));
        }
        return filtered;
    },[pedidos,filtroEstado,searchTerm]);

    // --- Funciones buscar productos ---
    const fetchProducts=useCallback(async(search)=>{
        setLoadingProducts(true);
        try{
            const data=await api.fetchProducts({search});
            setProducts(data);
        }catch{ showAlert({title:"Error",message:"No se pudieron cargar los productos."});}
        finally{setLoadingProducts(false);}
    },[showAlert]);

    useEffect(()=>{
        const delay=setTimeout(()=>{if(orderSearch.trim()!=='') fetchProducts(orderSearch.trim());},300);
        return ()=>clearTimeout(delay);
    },[orderSearch,fetchProducts]);

    const addProductToOrder=(product)=>{
        const exists=selectedProducts.find(p=>p.id===product.id);
        if(exists) setSelectedProducts(selectedProducts.map(p=>p.id===product.id?{...p, quantity:p.quantity+1}:p));
        else setSelectedProducts([...selectedProducts,{...product,quantity:1}]);
    };
    const updateQuantity=(id,qty)=>{setSelectedProducts(selectedProducts.map(p=>p.id===id?{...p,quantity:Number(qty)}:p));};
    const removeProduct=id=>setSelectedProducts(selectedProducts.filter(p=>p.id!==id));
    const total=selectedProducts.reduce((acc,p)=>acc+p.precio*p.quantity,0);

    // --- Funciones buscar clientes ---
    const fetchClients=useCallback(async(search)=>{
        try{
            const data=await api.fetchClients({search});
            setClients(data);
        }catch{showAlert({title:"Error",message:"No se pudieron cargar los clientes."});}
    },[showAlert]);

    useEffect(()=>{
        const delay=setTimeout(()=>{if(clienteSearch.trim()!=='') fetchClients(clienteSearch.trim());},300);
        return ()=>clearTimeout(delay);
    },[clienteSearch,fetchClients]);

    const handleCreateOrder=async()=>{
        if(!clienteId) return showAlert({title:"Cliente requerido",message:"Debes seleccionar un cliente."});
        if(selectedProducts.length===0) return showAlert({title:"Productos requeridos",message:"Debes agregar al menos un producto."});
        const orderData={
            clienteId,
            items:selectedProducts.map(p=>({id:p.id,quantity:p.quantity,precio:p.precio})),
            total,
            abonoInicial:0,
            pagoDetalles:[]
        };
        try{
            await api.createOrder(orderData,token);
            showAlert({title:"Éxito",message:"Pedido creado correctamente."});
            await fetchPedidos();
            closeModal();
            setSelectedProducts([]);
            setOrderSearch('');
            setClienteSearch('');
            setClienteId(null);
        }catch(error){showAlert({title:"Error",message:error.message});}
    };

    if(isLoading) return <PageWrapper><h1>Cargando pedidos...</h1></PageWrapper>;
    if(!user) return <PageWrapper><h1>No estás autenticado.</h1></PageWrapper>;

    return (
        <PageWrapper>
            <HeaderContainer>
                <Title><FaClipboardList /> Pedidos y Apartados</Title>
                <div>
                    <Button $primary onClick={()=>openModal('createOrder')} disabled={!isCajaOpen} style={{marginRight:'1rem'}}>
                        <FaPlus /> Crear Pedido
                    </Button>
                    <BackButton to="/dashboard"><FaArrowLeft/> Volver</BackButton>
                </div>
            </HeaderContainer>
            {!isCajaOpen && <p style={{color:'red', textAlign:'center'}}>La caja está cerrada.</p>}

            <ContentGrid>
                <FilterPanel>
                    <div>
                        <h3 style={{marginTop:0, display:'flex', alignItems:'center', gap:'0.5rem'}}><FaSearch /> Buscar</h3>
                        <Input type="text" placeholder="ID o nombre..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} />
                    </div>
                    <div>
                        <h3 style={{marginTop:0, display:'flex', alignItems:'center', gap:'0.5rem'}}><FaFilter /> Filtrar por Estado</h3>
                        <Select value={filtroEstado} onChange={e=>setFiltroEstado(e.target.value)}>
                            <option value="Activos">Activos</option>
                            <option value="Todos">Todos</option>
                            <option value="Apartado">Apartados</option>
                            <option value="Pendiente">Pendientes</option>
                            <option value="Completado">Completados</option>
                            <option value="Cancelado">Cancelados</option>
                        </Select>
                    </div>
                </FilterPanel>

                <main>
                    <div style={{display:'flex', flexDirection:'column', gap:'1.5rem'}}>
                        {pedidosFiltrados.length>0? pedidosFiltrados.map(p=>{
                            const saldo= p.total - p.abonado;
                            const percent= p.total>0? (p.abonado/p.total)*100:0;
                            return (
                                <PedidoCard key={p.id} estado={p.estado}>
                                    <CardBody>{/* Aquí podrías abrir modal detalle pedido */}</CardBody>
                                    <CardFooter><ProgressBar percent={percent}><div></div></ProgressBar></CardFooter>
                                </PedidoCard>
                            );
                        }):<EmptyState><FaBoxOpen /><p>No se han encontrado pedidos.</p></EmptyState>}
                    </div>
                </main>
            </ContentGrid>

            {/* MODAL CREAR PEDIDO */}
            {modal.name==='createOrder' && (
                <ModalOverlay>
                    <ModalContent>
                        <CloseButton onClick={closeModal}><FaTimes /></CloseButton>
                        <h2>Crear Pedido</h2>

                        {/* BUSCAR CLIENTE */}
                        <Section>
                            <label>Buscar cliente:</label>
                            <Input placeholder="Nombre o ID..." value={clienteSearch} onChange={e=>setClienteSearch(e.target.value)} />
                            <ClientList>
                                {clients.map(c=>(
                                    <ProductItem key={c.id} onClick={()=>{setClienteId(c.id); setClienteSearch(c.nombre); setClients([]);}}>
                                        {c.nombre} (ID: {c.id})
                                    </ProductItem>
                                ))}
                            </ClientList>
                        </Section>

                        {/* BUSCAR PRODUCTOS */}
                        <Section>
                            <label>Buscar productos:</label>
                            <Input placeholder="Nombre o código..." value={orderSearch} onChange={e=>setOrderSearch(e.target.value)} />
                            {loadingProducts && <p>Cargando...</p>}
                            <ProductList>{products.map(p=><ProductItem key={p.id} onClick={()=>addProductToOrder(p)}>{p.nombre} - C${p.precio.toFixed(2)}</ProductItem>)}</ProductList>
                        </Section>

                        {/* LISTA DE PRODUCTOS SELECCIONADOS */}
                        <Section>
                            <label>Productos en el pedido:</label>
                            {selectedProducts.length>0?(
                                <OrderTable>
                                    <thead><tr><th>Nombre</th><th>Cantidad</th><th>Precio</th><th>Total</th><th></th></tr></thead>
                                    <tbody>{selectedProducts.map(p=>(
                                        <tr key={p.id}>
                                            <td>{p.nombre}</td>
                                            <td><input type="number" min="1" value={p.quantity} onChange={e=>updateQuantity(p.id,e.target.value)} /></td>
                                            <td>C${p.precio.toFixed(2)}</td>
                                            <td>C${(p.precio*p.quantity).toFixed(2)}</td>
                                            <td><Button onClick={()=>removeProduct(p.id)} style={{background:'#dc3545'}}>Eliminar</Button></td>
                                        </tr>
                                    ))}</tbody>
                                </OrderTable>
                            ):<p>No hay productos agregados.</p>}
                        </Section>

                        <Section>
                            <p><strong>Total Pedido: C${total.toFixed(2)}</strong></p>
                            <Button $primary onClick={handleCreateOrder}><FaPlus /> Crear Pedido</Button>
                        </Section>
                    </ModalContent>
                </ModalOverlay>
            )}

            {/* MODAL ALERT */}
            {modal.name==='alert' && <ModalOverlay><ModalContent><CloseButton onClick={closeModal}><FaTimes /></CloseButton><h3>{modal.props.title}</h3><p>{modal.props.message}</p></ModalContent></ModalOverlay>}

        </PageWrapper>
    );
};

export default PedidosYApartados;
