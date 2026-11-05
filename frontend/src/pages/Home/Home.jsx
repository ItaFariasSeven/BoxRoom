import CardItem from "../../components/CardItem/CardItem"
import TotalItens from "../../components/InfoItens/TotalItens"
import LowItens from "../../components/InfoItens/LowItens"
import ValueStock from "../../components/InfoItens/ValueStock"
import DashBoardBar from "../../components/InfoBar/DashBoardBar"
// import {ItensList} from "../../components/InfoBar/ItensList"
import './HomeModule.css'

import { useQuery } from "@tanstack/react-query";

import { listarItens, buscarDashboard } from "../../services/api";

import { useSearchParams } from "react-router-dom";
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import Button from '@mui/material/Button';
import { useViewMode } from '../../contexts/ViewModeContext';
import SearchIcon from '@mui/icons-material/Search';import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(2),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}));


export default function Home() {
    const [searchParams, setSearchParams] = useSearchParams();

    const { viewMode, setViewMode } = useViewMode();

    // Pega o valor atual da busca pela URL. Se não existir, usa uma string vazia.
    const busca = searchParams.get("busca") ?? "";
    
    function handleBusca(event) {
        const valor = event.target.value;
        const novosParametros = new URLSearchParams(searchParams);

        if (valor.trim()) {
            novosParametros.set("busca", valor);
        } else {
            novosParametros.delete("busca");
        }
        
        setSearchParams(novosParametros, { replace: true });
    }

    // Buscar produtos para carregar na tela
    const {
        data: itens = [],
        isLoading: carregandoItens,
        error: erroItens
    } = useQuery({
        queryKey: ["itens"],
        queryFn: listarItens
    });

    //  Buscar informações do dashboard
    const {
        data: dashboard,
        isLoading: carregandoDashboard,
        error: erroDashboard
    } = useQuery({
        queryKey: ["dashboard"],
        queryFn: buscarDashboard
    });

    if (
        carregandoItens ||carregandoDashboard
    ) {
        return <p>Carregando estoque...</p>;
    }

    if (
        erroItens || erroDashboard
    ) {
        return (
            <p>Não foi possível carregar o estoque.</p>
        );
    }
    
    // Pega o que a NavBar colocou na URL.
    const termoBusca = (
        searchParams.get("busca") ?? ""
    )
        .trim()
        .toLowerCase();
    // Cria outra lista. Não altera a lista original do React Query.
    const itensFiltrados = itens.filter(
        (item) => {
    
            // Pesquisar pelo nome.
            const nome =
                item.nome
                    ?.toLowerCase()
                    ?? "";
    
            // Pesquisar pela categoria.
            const categoria =
                item.categoria_nome
                    ?.toLowerCase()
                    ?? "";
    
            return (
                nome.includes(termoBusca)
                ||
                categoria.includes(termoBusca)
            );
        }
    );

    return (
        <main className="home-container">
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                className='barra-pesquisa'
                type='text'
                placeholder="Pesquisar…"
                value={busca}
                onChange={handleBusca}
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>

            {/* Apenas um mapeamento com as classes corretas baseadas no Contexto */}
            <div className={viewMode === 'grid' ? "cards-itens" : "cards-itens-list"}>
                {itensFiltrados.map((item) =>(
                    <CardItem
                        key={item.id}
                        item={item}
                        viewMode={viewMode} // Passando a prop pro card entender
                    />
                ))}
            </div>
        </main>
    )
}