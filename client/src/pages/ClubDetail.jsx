import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import { Country, City } from 'country-state-city';
import { 
  ShieldCheck, 
  MapPin, 
  Users, 
  Award, 
  MoreVertical, 
  Trash2, 
  LogOut, 
  MessageSquare, 
  Instagram, 
  UserPlus, 
  Check, 
  Edit3, 
  Save, 
  X, 
  Sparkles, 
  Crown, 
  Globe, 
  Calendar, 
  Building, 
  Image as ImageIcon, 
  Clock, 
  AlertTriangle, 
  AlertCircle, 
  Upload, 
  Link as LinkIcon, 
  RotateCcw, 
  Copy, 
  ExternalLink, 
  FileText, 
  Send, 
  UserCheck, 
  PlusCircle, 
  Search, 
  Mail, 
  Inbox,
  CheckCircle,
  XCircle 
} from 'lucide-react';
import './ClubDetail.css';

const americanCodes = ['AR', 'BO', 'BR', 'CA', 'CL', 'CO', 'CR', 'CU', 'DO', 'EC', 'SV', 'GT', 'HN', 'MX', 'NI', 'PA', 'PY', 'PE', 'PR', 'UY', 'VE', 'US', 'JM', 'HT', 'TT'];
const allCountries = Country.getAllCountries().filter(c => americanCodes.includes(c.isoCode));

const formatDateLong = (dateString) => {
  if (!dateString) return 'No especificada';
  try {
    const cleanStr = String(dateString).split('T')[0];
    const parts = cleanStr.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      const months = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
      ];
      const mIdx = parseInt(month, 10) - 1;
      if (mIdx >= 0 && mIdx < 12) {
        return `${parseInt(day, 10)} de ${months[mIdx]} de ${year}`;
      }
    }
    const d = new Date(dateString);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
    }
    return dateString;
  } catch {
    return dateString;
  }
};

const calculateDaysRemaining = (expiryDateString) => {
  if (!expiryDateString) return null;
  try {
    const expiry = new Date(expiryDateString);
    const now = new Date();
    const diffMs = expiry.getTime() - now.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  } catch {
    return null;
  }
};
const PRESET_CLUB_ROLES = [
  { id: '⚡ Vicepresidente', label: '⚡ Vicepresidente', icon: '⚡', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.15)', border: 'rgba(168, 85, 247, 0.4)' },
  { id: '🛡️ Capitán de Ruta', label: '🛡️ Capitán de Ruta', icon: '🛡️', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)', border: 'rgba(56, 189, 248, 0.4)' },
  { id: '💼 Tesorero', label: '💼 Tesorero', icon: '💼', color: '#4ade80', bg: 'rgba(74, 222, 128, 0.15)', border: 'rgba(74, 222, 128, 0.4)' },
  { id: '📜 Secretario', label: '📜 Secretario', icon: '📜', color: '#fb923c', bg: 'rgba(251, 146, 60, 0.15)', border: 'rgba(251, 146, 60, 0.4)' },
  { id: '📢 Vocero / RPR', label: '📢 Vocero / RPR', icon: '📢', color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.15)', border: 'rgba(244, 63, 94, 0.4)' },
  { id: '🛠️ Sargento de Armas', label: '🛠️ Sargento de Armas', icon: '🛠️', color: '#e2e8f0', bg: 'rgba(226, 232, 240, 0.15)', border: 'rgba(226, 232, 240, 0.4)' },
  { id: '🏍️ Miembro Oficial', label: '🏍️ Miembro Oficial', icon: '🏍️', color: '#ff8c00', bg: 'rgba(255, 140, 0, 0.12)', border: 'rgba(255, 140, 0, 0.3)' },
  { id: 'CUSTOM', label: '✍️ Cargo Personalizado...', icon: '✍️', color: '#f472b6', bg: 'rgba(244, 114, 182, 0.15)', border: 'rgba(244, 114, 182, 0.4)' }
];

const renderMemberRoleBadge = (member, isMemberLeader) => {
  if (isMemberLeader) {
    return (
      <span style={{
        background: 'rgba(255, 215, 0, 0.15)',
        color: '#ffd700',
        border: '1px solid rgba(255, 215, 0, 0.4)',
        padding: '2px 7px',
        borderRadius: '10px',
        fontWeight: 900,
        fontSize: '0.7rem'
      }}>
        👑 LÍDER
      </span>
    );
  }

  const roleTitle = member.clubRole || 'Miembro Oficial';
  const foundPreset = PRESET_CLUB_ROLES.find(p => p.id === roleTitle || p.label === roleTitle);

  if (foundPreset && foundPreset.id !== 'CUSTOM') {
    return (
      <span style={{
        background: foundPreset.bg,
        color: foundPreset.color,
        border: `1px solid ${foundPreset.border}`,
        padding: '2px 7px',
        borderRadius: '10px',
        fontWeight: 800,
        fontSize: '0.7rem'
      }}>
        {foundPreset.label}
      </span>
    );
  }

  return (
    <span style={{
      background: 'rgba(168, 85, 247, 0.15)',
      color: '#c084fc',
      border: '1px solid rgba(168, 85, 247, 0.4)',
      padding: '2px 7px',
      borderRadius: '10px',
      fontWeight: 800,
      fontSize: '0.7rem'
    }}>
      🎖️ {roleTitle}
    </span>
  );
};

const ClubDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joined, setJoined] = useState(false);
  const [requestingJoin, setRequestingJoin] = useState(false);
  const [userJoinStatus, setUserJoinStatus] = useState('NONE'); // NONE, PENDING, APPROVED, REJECTED
  const [pendingRequests, setPendingRequests] = useState([]);

  // State for Editing Member Cargo/Role & Member Management Modal
  const [showManageMembersModal, setShowManageMembersModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [targetMember, setTargetMember] = useState(null);
  const [selectedRolePreset, setSelectedRolePreset] = useState('Miembro Oficial');
  const [customRoleInput, setCustomRoleInput] = useState('');
  const [roleSaving, setRoleSaving] = useState(false);

  const handleSaveMemberRole = async () => {
    if (!targetMember || !club) return;

    const finalRole = selectedRolePreset === 'CUSTOM' ? customRoleInput.trim() : selectedRolePreset;
    if (!finalRole) {
      alert('Por favor especifica un cargo válido');
      return;
    }

    setRoleSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/clubs/${club.id}/update-member-role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          memberId: targetMember.id,
          clubRole: finalRole
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert(`Cargo de ${targetMember.name} actualizado a '${finalRole}' con éxito.`);
        setShowRoleModal(false);
        setTargetMember(null);
        fetchClubDetail();
      } else {
        alert(data.message || 'Error al actualizar cargo');
      }
    } catch (err) {
      console.error('Error actualizando cargo:', err);
      alert('Error de conexión al guardar el cargo.');
    } finally {
      setRoleSaving(false);
    }
  };

  const handleDeleteClub = async () => {
    if (!club) return;
    const confirmMsg = club.isSubscriptionActive
      ? `¿Estás seguro de que deseas eliminar permanentemente el Moto Club "${club.name}"?\n\nNOTA: Tu suscripción VIP activa se conservará y se transferirá automáticamente a tu próximo club.`
      : `¿Estás seguro de que deseas eliminar permanentemente el Moto Club "${club.name}"? Esta acción no se puede deshacer.`;

    if (!window.confirm(confirmMsg)) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/clubs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || 'Moto Club eliminado con éxito.');
        navigate('/clubs');
      } else {
        alert(data.message || 'Error eliminando el Moto Club');
      }
    } catch (err) {
      console.error('Error eliminando el club:', err);
      alert('Error de conexión al intentar eliminar el club.');
    }
  };

  const handleLeaveClub = async () => {
    if (!club) return;
    if (!window.confirm(`¿Estás seguro de que deseas salir del Moto Club "${club.name}"?`)) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/clubs/${id}/leave`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || 'Has salido del club con éxito.');
        setJoined(false);
        setUserJoinStatus('NONE');
        fetchClubDetail();
      } else {
        alert(data.message || 'Error al intentar salir del club.');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión.');
    }
  };

  // Leader Dropdown Menu State
  const [showLeaderMenu, setShowLeaderMenu] = useState(false);
  const leaderMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (leaderMenuRef.current && !leaderMenuRef.current.contains(event.target)) {
        setShowLeaderMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Add Member Modal State for Leader
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [memberEmailInput, setMemberEmailInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loadingAvailableUsers, setLoadingAvailableUsers] = useState(false);
  const [addingMember, setAddingMember] = useState(false);

  useEffect(() => {
    if (showAddMemberModal) {
      fetchAvailableUsers();
    }
  }, [showAddMemberModal]);

  const fetchAvailableUsers = async () => {
    try {
      setLoadingAvailableUsers(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/users/available-for-club`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setAvailableUsers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAvailableUsers(false);
    }
  };

  // Edit Mode state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [logoInputType, setLogoInputType] = useState('file');
  const [bannerInputType, setBannerInputType] = useState('file');
  const [logoFileName, setLogoFileName] = useState('');
  const [bannerFileName, setBannerFileName] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);

  // Resubmit Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('nequi');
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [paymentRef, setPaymentRef] = useState('');
  const [proofImageBase64, setProofImageBase64] = useState('');
  const [proofFileName, setProofFileName] = useState('');
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [copiedNequi, setCopiedNequi] = useState(false);
  const [copiedPaypal, setCopiedPaypal] = useState(false);

  const [cities, setCities] = useState([]);

  const [pendingInvitation, setPendingInvitation] = useState(null);
  const [respondingInvitation, setRespondingInvitation] = useState(false);

  useEffect(() => {
    fetchClubDetail();
    if (isAuthenticated) {
      fetchPendingInvitations();
    }
  }, [id, isAuthenticated]);

  const fetchPendingInvitations = async () => {
    try {
      const token = localStorage.getItem('token');
      const urlParams = new URLSearchParams(window.location.search);
      const isInvitedViaUrl = urlParams.get('invitation');

      if (!token) return;
      const res = await fetch(`${API_URL}/api/clubs/invitations/pending`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      let found = null;
      if (res.ok) {
        const data = await res.json();
        found = data.find(inv => inv.clubId === parseInt(id));
      }

      if (!found && isInvitedViaUrl && !joined) {
        found = {
          id: parseInt(isInvitedViaUrl) || 'fallback',
          clubId: parseInt(id),
          status: 'PENDING'
        };
      }

      if (joined) {
        found = null;
      }

      setPendingInvitation(found);
    } catch (e) {
      console.error(e);
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('invitation') && !joined) {
        setPendingInvitation({ id: 'fallback', clubId: parseInt(id), status: 'PENDING' });
      }
    }
  };

  const handleRespondInvitation = async (invitationId, action) => {
    try {
      setRespondingInvitation(true);
      const token = localStorage.getItem('token');
      const targetInvId = invitationId || 'fallback';
      const res = await fetch(`${API_URL}/api/clubs/invitations/${targetInvId}/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action, clubId: parseInt(id) })
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setPendingInvitation(null);
        fetchClubDetail();
      } else {
        alert(data.message || 'Error al responder a la invitación');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRespondingInvitation(false);
    }
  };

  const handleRemoveMember = async (memberId, memberName) => {
    if (!window.confirm(`¿Estás seguro de que deseas desvincular a "${memberName}" de tu Moto Club?`)) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/clubs/${id}/remove-member`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId: memberId })
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        fetchClubDetail();
      } else {
        alert(data.message || 'Error al desvincular al miembro');
      }
    } catch (e) {
      console.error(e);
      alert('Error de conexión al desvincular al miembro');
    }
  };

  const fetchClubDetail = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await fetch(`${API_URL}/api/clubs/${id}`, { headers });
      const data = await res.json();
      if (res.ok) {
        setClub(data);
        setUserJoinStatus(data.userJoinStatus || 'NONE');
        setPendingRequests(data.pendingJoinRequests || []);
        
        const matchedCountryCode = allCountries.find(c => c.name === data.country)?.isoCode || (data.country === 'Colombia' ? 'CO' : '');
        if (matchedCountryCode) {
          setCities(City.getCitiesOfCountry(matchedCountryCode));
        } else {
          setCities(City.getCitiesOfCountry('CO'));
        }

        setEditFormData({
          name: data.name || '',
          logo: data.logo || '',
          banner: data.banner || '',
          description: data.description || '',
          country: data.country || '',
          countryCode: matchedCountryCode || 'CO',
          city: data.city || '',
          whatsappGroup: data.whatsappGroup || '',
          instagram: data.instagram || ''
        });
        if (user && data.members?.some(m => String(m.id) === String(user.id))) {
          setJoined(true);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCountryChange = (e) => {
    const code = e.target.value;
    const countryName = allCountries.find(c => c.isoCode === code)?.name || '';
    setEditFormData({ ...editFormData, countryCode: code, country: countryName, city: '' });
    if (code) {
      setCities(City.getCitiesOfCountry(code));
    } else {
      setCities([]);
    }
  };

  const handleFileUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      if (field === 'logo') setLogoFileName(file.name);
      if (field === 'banner') setBannerFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditFormData(prev => ({ ...prev, [field]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenEditModal = () => {
    try {
      if (club) {
        const countryList = allCountries || [];
        const matchedCountryCode = countryList.find(c => c.name === club.country)?.isoCode || (club.country === 'Colombia' ? 'CO' : '');
        if (matchedCountryCode) {
          try {
            setCities(City.getCitiesOfCountry(matchedCountryCode) || []);
          } catch (e) {
            setCities([]);
          }
        } else {
          try {
            setCities(City.getCitiesOfCountry('CO') || []);
          } catch (e) {
            setCities([]);
          }
        }

        setEditFormData({
          name: club.name || '',
          logo: club.logo || '',
          banner: club.banner || '',
          description: club.description || '',
          country: club.country || '',
          countryCode: matchedCountryCode || 'CO',
          city: club.city || '',
          whatsappGroup: club.whatsappGroup || '',
          instagram: club.instagram || ''
        });
        setLogoInputType('url');
        setBannerInputType('url');
      }
    } catch (err) {
      console.error('Error preparando modal de edicion:', err);
    } finally {
      setShowEditModal(true);
      setShowLeaderMenu(false);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/clubs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editFormData)
      });
      const data = await res.json();
      if (res.ok) {
        setClub(data);
        setShowEditModal(false);
        alert('¡Moto Club actualizado con éxito!');
      } else {
        alert(data.message || 'Error guardando cambios');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleRequestJoin = async () => {
    if (!user) return alert('Debes iniciar sesión para solicitar unirte a un club');
    setRequestingJoin(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/clubs/${id}/request-join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setUserJoinStatus('PENDING');
        alert('¡Solicitud enviada! El líder del Moto Club revisará y aprobará tu ingreso.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRequestingJoin(false);
    }
  };

  const handleApproveJoinRequest = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/clubs/${id}/join-requests/${requestId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        alert('¡Miembro aprobado e integrado al club!');
        fetchClubDetail();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectJoinRequest = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/clubs/${id}/join-requests/${requestId}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        alert('Solicitud rechazada');
        fetchClubDetail();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUserSearch = async (val) => {
    setSearchQuery(val);
    if (!val || val.length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/users/search?q=${encodeURIComponent(val)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setSearchResults(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddMemberByEmail = async (emailToAdd) => {
    const targetEmail = emailToAdd || memberEmailInput;
    if (!targetEmail) return alert('Ingresa o selecciona un correo de usuario');
    setAddingMember(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/clubs/${id}/add-member`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email: targetEmail })
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setMemberEmailInput('');
        setSearchQuery('');
        setSearchResults([]);
        setShowAddMemberModal(false);
        fetchClubDetail();
      } else {
        alert(data.message || 'Error agregando miembro');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAddingMember(false);
    }
  };

  const copyNequi = () => {
    navigator.clipboard.writeText('3185503428');
    setCopiedNequi(true);
    setTimeout(() => setCopiedNequi(false), 2500);
  };

  const copyPaypal = () => {
    navigator.clipboard.writeText('wilmer7522@gmail.com');
    setCopiedPaypal(true);
    setTimeout(() => setCopiedPaypal(false), 2500);
  };

  const handleProofImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProofFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofImageBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResubmitPayment = async () => {
    if (!paymentRef.trim()) {
      alert('Por favor ingresa el número o ID de referencia de la transacción');
      return;
    }

    if (!proofImageBase64) {
      alert('Es obligatorio adjuntar la captura de pantalla del comprobante de pago');
      return;
    }

    setSubmittingPayment(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/clubs/${id}/submit-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          paymentReference: `${paymentMethod.toUpperCase()}: ${paymentRef}`,
          paymentImage: proofImageBase64,
          selectedPlan
        })
      });

      if (res.ok) {
        alert('¡Nuevo comprobante enviado a verificación! El administrador revisará tu pago activando tu insignia dorada VIP.');
        setShowPaymentModal(false);
        fetchClubDetail();
      } else {
        alert('Error al enviar el comprobante');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingPayment(false);
    }
  };

  if (loading) return <div className="club-detail-loading">Cargando Moto Club...</div>;
  if (!club) return <div className="club-detail-error">Moto Club no encontrado</div>;

  const isLeader = Boolean(user && club && String(user.id) === String(club.leaderId));

  return (
    <div className="club-detail-page full-bleed">
      <div className="container">
        
        {/* Banner Hero */}
        <div className="club-detail-hero" style={{ backgroundImage: `url(${club.banner || '/assets/garage-bg.jpg'})` }}>
          <div className="hero-overlay"></div>

          {/* Insignia VIP colocada exactamente en la esquina superior derecha del banner */}
          <div style={{ position: 'absolute', top: '1.2rem', right: '1.5rem', zIndex: 30 }}>
            {club.isSubscriptionActive ? (
              <span className="gold-vip-badge">
                <Crown size={15} /> CLUB VERIFICADO VIP
              </span>
            ) : club.paymentStatus === 'PENDING_VERIFICATION' ? (
              <span className="pending-verification-badge">
                <Clock size={15} /> EN VERIFICACIÓN DE PAGO
              </span>
            ) : (
              <span className="standard-club-tag">MOTO CLUB</span>
            )}
          </div>

          {/* Cabecera del Club Totalmente Centrada en el Medio del Banner */}
          <div className="club-hero-header" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            width: '100%',
            padding: '2.2rem 1.5rem'
          }}>
            <div className="club-badge-ring" style={{ margin: '0 auto 0.8rem auto' }}>
              {club.logo ? (
                <img src={club.logo} alt={club.name} className="hero-logo-img" />
              ) : (
                <div className="hero-logo-fallback">{club.name.charAt(0)}</div>
              )}
            </div>

            <div className="club-hero-info" style={{ textAlign: 'center' }}>
              <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#ffffff', margin: '0 0 0.4rem 0', textShadow: '0 4px 20px rgba(0, 0, 0, 0.85)' }}>
                {club.name}
              </h1>
              <p className="club-location-meta" style={{ justifyContent: 'center', margin: '0 auto' }}>
                <MapPin size={16} /> {club.city}, {club.country} • <Award size={16} /> LÍDER: {club.leaderName} • <Calendar size={15} style={{ color: '#ff8c00', verticalAlign: 'middle', marginLeft: '4px' }} /> Fundado: {formatDateLong(club.createdAt)}
              </p>
            </div>

            {!isLeader && (
              <div className="club-hero-actions" style={{ marginTop: '1.2rem' }}>
                {joined ? (
                  <div className="member-actions-group" style={{ display: 'inline-flex', gap: '0.75rem', alignItems: 'center' }}>
                    <button className="btn-joined" disabled>
                      <Check size={16} /> MIEMBRO DEL CLUB
                    </button>
                    <button className="btn-leave-club-outline" onClick={handleLeaveClub}>
                      <LogOut size={16} /> Salir del Club
                    </button>
                  </div>
                ) : userJoinStatus === 'PENDING' ? (
                  <button className="btn-pending-join" disabled>
                    <Clock size={16} /> Solicitud Enviada (Pendiente)
                  </button>
                ) : (
                  <button className="btn-join-glow" onClick={handleRequestJoin} disabled={requestingJoin}>
                    <UserPlus size={16} /> {requestingJoin ? 'Enviando...' : 'Solicitar Unirse al Club'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Banner de Invitación Pendiente para el Usuario Invitado */}
        {pendingInvitation && !joined && !isLeader && (
          <div className="pending-invitation-banner" style={{
            background: 'linear-gradient(135deg, rgba(255, 140, 0, 0.25), rgba(15, 23, 42, 0.95))',
            border: '2px solid #ff8c00',
            borderRadius: '16px',
            padding: '1.4rem 1.8rem',
            marginBottom: '1.8rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1.2rem',
            boxShadow: '0 12px 35px rgba(255, 140, 0, 0.35)',
            animation: 'fadeInDown 0.3s ease-out'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Crown size={32} style={{ color: '#ffd700', flexShrink: 0 }} />
              <div>
                <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.1rem', fontWeight: 900 }}>
                  ¡INVITACIÓN OFICIAL PARA UNIRTE A ESTE MOTO CLUB!
                </h3>
                <p style={{ margin: '0.3rem 0 0 0', color: '#e2e8f0', fontSize: '0.9rem' }}>
                  El presidente de <strong>{club.name}</strong> te ha enviado una invitación oficial para unirte como miembro de su club.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.8rem' }}>
              <button 
                className="btn-accept-invitation"
                style={{
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '10px 22px',
                  fontWeight: 900,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 15px rgba(34, 197, 94, 0.4)'
                }}
                onClick={() => handleRespondInvitation(pendingInvitation.id, 'ACCEPT')}
                disabled={respondingInvitation}
              >
                <CheckCircle size={18} /> Aceptar e Integrarme
              </button>

              <button 
                className="btn-reject-invitation"
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  color: '#ef4444',
                  border: '1px solid #ef4444',
                  borderRadius: '12px',
                  padding: '10px 18px',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onClick={() => handleRespondInvitation(pendingInvitation.id, 'REJECT')}
                disabled={respondingInvitation}
              >
                <XCircle size={18} /> Declinar
              </button>
            </div>
          </div>
        )}

        {/* Tarjeta Exclusiva de Estado de Suscripción del Presidente + Menú Hamburguesa DEBAJO DEL BANNER */}
        {isLeader && (
          <div className="president-vip-status-card" style={{
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(255, 140, 0, 0.4)',
            borderRadius: '16px',
            padding: '1.2rem 1.6rem',
            marginBottom: '1.8rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(12px)',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
              <Crown size={26} style={{ color: '#ffd700', flexShrink: 0 }} />
              <div>
                <h4 style={{ margin: 0, color: '#f8fafc', fontSize: '0.96rem', fontWeight: '800', letterSpacing: '0.02rem' }}>
                  ESTADO DE SUSCRIPCIÓN PRESIDENTE VIP
                </h4>
                {club.subscriptionExpiresAt && (
                  <p style={{ margin: '0.25rem 0 0 0', color: '#94a3b8', fontSize: '0.86rem' }}>
                    Fecha de Vencimiento: <strong style={{ color: '#f1f5f9' }}>{formatDateLong(club.subscriptionExpiresAt)}</strong>
                  </p>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              {club.subscriptionExpiresAt && (() => {
                const days = calculateDaysRemaining(club.subscriptionExpiresAt);
                if (days === null) return null;
                if (days > 0) {
                  return (
                    <span style={{
                      background: 'rgba(34, 197, 94, 0.15)',
                      color: '#4ade80',
                      border: '1px solid rgba(74, 222, 128, 0.4)',
                      padding: '6px 16px',
                      borderRadius: '20px',
                      fontWeight: '800',
                      fontSize: '0.85rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}>
                      🎯 {days} {days === 1 ? 'día restante' : 'días restantes'}
                    </span>
                  );
                } else if (days >= -3) {
                  return (
                    <span style={{
                      background: 'rgba(245, 158, 11, 0.2)',
                      color: '#f59e0b',
                      border: '1px solid #f59e0b',
                      padding: '6px 16px',
                      borderRadius: '20px',
                      fontWeight: '800',
                      fontSize: '0.85rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}>
                      ⚠️ En Prórroga (Venció hace {Math.abs(days)} {Math.abs(days) === 1 ? 'día' : 'días'})
                    </span>
                  );
                } else {
                  return (
                    <span style={{
                      background: 'rgba(239, 68, 68, 0.2)',
                      color: '#ef4444',
                      border: '1px solid #ef4444',
                      padding: '6px 16px',
                      borderRadius: '20px',
                      fontWeight: '800',
                      fontSize: '0.85rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}>
                      🔴 Suscripción Vencida
                    </span>
                  );
                }
              })()}

              {/* Menú Hamburguesa de Gestión ubicado de forma limpia en el panel de control */}
              <div className="leader-menu-wrapper" ref={leaderMenuRef} style={{ position: 'relative', display: 'inline-block' }}>
                <button 
                  className="btn-leader-gear-menu"
                  onClick={() => setShowLeaderMenu(!showLeaderMenu)}
                  style={{
                    background: 'rgba(255, 140, 0, 0.15)',
                    color: '#ff8c00',
                    border: '1px solid #ff8c00',
                    borderRadius: '12px',
                    padding: '8px 16px',
                    fontWeight: '800',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <MoreVertical size={17} style={{ color: '#ff8c00' }} /> ⚙️ Opciones de Gestión
                </button>

                {showLeaderMenu && (
                  <div 
                    className="leader-dropdown-menu"
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      background: '#0f172a',
                      border: '1px solid rgba(255, 140, 0, 0.4)',
                      borderRadius: '14px',
                      boxShadow: '0 12px 35px rgba(0, 0, 0, 0.95)',
                      padding: '8px',
                      zIndex: 9999,
                      minWidth: '235px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                  >
                    <button
                      onClick={handleOpenEditModal}
                      style={{
                        background: 'transparent',
                        color: '#f8fafc',
                        border: 'none',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        textAlign: 'left',
                        fontWeight: '700',
                        fontSize: '0.88rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <Edit3 size={16} style={{ color: '#ffd700' }} /> Editar Información del Club
                    </button>

                    {club.isSubscriptionActive ? (
                      <>
                        <button
                          onClick={() => { setShowAddMemberModal(true); setShowLeaderMenu(false); }}
                          style={{
                            background: 'transparent',
                            color: '#f8fafc',
                            border: 'none',
                            padding: '10px 14px',
                            borderRadius: '8px',
                            textAlign: 'left',
                            fontWeight: '700',
                            fontSize: '0.88rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          <PlusCircle size={16} style={{ color: '#4ade80' }} /> Agregar Miembro al Club
                        </button>

                        <button
                          onClick={() => { setShowManageMembersModal(true); setShowLeaderMenu(false); }}
                          style={{
                            background: 'transparent',
                            color: '#f8fafc',
                            border: 'none',
                            padding: '10px 14px',
                            borderRadius: '8px',
                            textAlign: 'left',
                            fontWeight: '700',
                            fontSize: '0.88rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          <Award size={16} style={{ color: '#c084fc' }} /> Gestionar Cargos y Miembros
                        </button>
                      </>
                    ) : null}

                    <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.1)', margin: '4px 0' }} />

                    <button
                      onClick={() => { handleDeleteClub(); setShowLeaderMenu(false); }}
                      style={{
                        background: 'rgba(239, 68, 68, 0.12)',
                        color: '#ef4444',
                        border: 'none',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        textAlign: 'left',
                        fontWeight: '700',
                        fontSize: '0.88rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <Trash2 size={16} /> Eliminar Moto Club
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Notificaciones de Estado de Suscripción para el Líder */}
        {isLeader && club.paymentStatus === 'GRACE_PERIOD' && (
          <div className="status-alert-box warning-grace" style={{ background: 'rgba(245, 158, 11, 0.12)', border: '1px solid #f59e0b', borderRadius: '12px', padding: '1.2rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <AlertTriangle size={28} style={{ color: '#f59e0b', flexShrink: 0 }} />
            <div className="alert-content-col" style={{ flex: 1 }}>
              <h4 style={{ color: '#f59e0b', margin: 0, fontSize: '1rem', fontWeight: 900 }}>⚠️ EN PRÓRROGA DE GRACIA (3 DÍAS MÁXIMO)</h4>
              <p style={{ color: '#e2e8f0', margin: '0.4rem 0 0.8rem 0', fontSize: '0.9rem' }}>
                Tu mensualidad VIP venció el {club.subscriptionExpiresAt ? new Date(club.subscriptionExpiresAt).toLocaleDateString() : ''}. Tienes 3 días de gracia para realizar tu renovación antes de que se inhabiliten los beneficios del Moto Club. Al renovar, tu nuevo ciclo continuará a partir de la fecha de vencimiento original.
              </p>
              <button className="btn-retry-payment-glow" onClick={() => setShowPaymentModal(true)}>
                <Crown size={16} /> Renovar Suscripción VIP Ahora
              </button>
            </div>
          </div>
        )}

        {isLeader && club.paymentStatus === 'PENDING_VERIFICATION' && (
          <div className="status-alert-box pending">
            <Clock size={22} className="alert-icon" />
            <div>
              <h4>PAGO EN VERIFICACIÓN DE ADMINISTRACIÓN</h4>
              <p>Tu comprobante de transferencia ha sido enviado y está siendo verificado. Tu Insignia Dorada VIP se activará en breve.</p>
            </div>
          </div>
        )}

        {isLeader && club.paymentStatus === 'REJECTED' && (
          <div className="status-alert-box rejected">
            <AlertTriangle size={24} className="alert-icon" />
            <div className="alert-content-col">
              <h4>SOLICITUD DE SUSCRIPCIÓN RECHAZADA</h4>
              <p><strong>Motivo del Rechazo:</strong> {club.rejectionReason || 'Comprobante no válido o valor no coincidente.'}</p>
              <button className="btn-retry-payment-glow" onClick={() => setShowPaymentModal(true)}>
                <RotateCcw size={16} /> Reenviar Comprobante / Intentar Nuevo Pago
              </button>
            </div>
          </div>
        )}

        {isLeader && (club.paymentStatus === 'EXPIRED' || (!club.isSubscriptionActive && club.subscriptionExpiresAt)) && (
          <div className="status-alert-box expired">
            <AlertCircle size={24} className="alert-icon" />
            <div className="alert-content-col">
              <h4>SUSCRIPCIÓN VIP VENCIDA</h4>
              <p>Tu período de suscripción VIP de 30 días ha finalizado. Renueva tu suscripción para reactivar tu Insignia Dorada VIP.</p>
              <button className="btn-retry-payment-glow" onClick={() => setShowPaymentModal(true)}>
                <Crown size={16} /> Renovar Suscripción VIP
              </button>
            </div>
          </div>
        )}

        {/* MÁS SECCIÓN PARA EL LÍDER: Solicitudes Pendientes de Ingreso */}
        {isLeader && pendingRequests && pendingRequests.length > 0 && (
          <div className="pending-requests-card">
            <div className="card-title-row">
              <h3><Inbox size={20} className="gold-icon" /> Solicitudes de Ingreso Pendientes ({pendingRequests.length})</h3>
              <span className="badge-requests">Nuevas solicitudes</span>
            </div>

            <div className="requests-list">
              {pendingRequests.map(req => (
                <div key={req.id} className="request-item-card">
                  <div className="user-req-info">
                    <div className="req-avatar">
                      {req.avatar ? <img src={req.avatar} alt={req.name} /> : <span>{req.name.charAt(0)}</span>}
                    </div>
                    <div>
                      <h4>{req.name}</h4>
                      <span className="req-email"><Mail size={12} /> {req.email}</span>
                    </div>
                  </div>

                  <div className="req-actions">
                    <button className="btn-approve-req" onClick={() => handleApproveJoinRequest(req.id)}>
                      <Check size={14} /> Aprobar Ingreso
                    </button>
                    <button className="btn-reject-req" onClick={() => handleRejectJoinRequest(req.id)}>
                      <X size={14} /> Rechazar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VISTA Y CONTENIDO PRINCIPAL DEL CLUB */}
        <div className="club-detail-grid">
              
              {/* Columna Izquierda: Información Principal */}
              <div className="club-main-col">
                <section className="detail-section">
                  <h2>Acerca del Moto Club</h2>
                  <p className="description-text">
                    {club.description || 'Este Moto Club oficial no ha agregado una descripción detallada aún.'}
                  </p>
                </section>
              </div>

              {/* Columna Derecha: Canales y Contactos */}
              <div className="club-sidebar-col">
                <div className="sidebar-card">
                  <h3>Contacto Oficial del Club</h3>
                  
                  {club.whatsappGroup && (
                    <a href={club.whatsappGroup} target="_blank" rel="noopener noreferrer" className="social-link whatsapp">
                      <MessageSquare size={18} /> Grupo Oficial de WhatsApp
                    </a>
                  )}

                  {club.instagram && (
                    <a href={`https://instagram.com/${club.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="social-link instagram">
                      <Instagram size={18} /> Instagram: {club.instagram}
                    </a>
                  )}

                  <div className="verified-footer-note">
                    <ShieldCheck size={16} /> Moto Club Verificado en Moto X Cult
                  </div>
                </div>
              </div>
            </div>

            {/* Sección de Miembros en ANCHO COMPLETO (100% Width) Abarcando Todo el Ancho del Sitio */}
            <section className="detail-section full-width-members-section" style={{ width: '100%', marginTop: '2rem' }}>
              <div className="section-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <h2>Miembros Oficiales ({club.members?.length || 0})</h2>
              </div>

              <div className="members-ordered-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', width: '100%' }}>
                {club.members && club.members.length > 0 ? (
                  club.members.map((member, idx) => {
                    const isMemberLeader = String(member.id) === String(club.leaderId);
                    const isClubMember = isLeader || joined;
                    const canSeePlate = isLeader || (user && String(user.id) === String(member.id));

                    return (
                      <div key={member.id} className="member-detail-row" style={{
                        background: 'rgba(15, 23, 42, 0.85)',
                        border: isMemberLeader ? '1px solid rgba(255, 215, 0, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '14px',
                        padding: '0.8rem 1.4rem',
                        display: 'grid',
                        gridTemplateColumns: 'minmax(240px, 1.8fr) minmax(180px, 1.5fr) minmax(140px, 1.2fr) minmax(150px, 1.2fr) minmax(100px, 1fr)',
                        alignItems: 'center',
                        gap: '1rem',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                        width: '100%',
                        overflowX: 'auto'
                      }}>
                        {/* 1. Slot: Biker Info (#1, Avatar, Name, Role, Moto) */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', minWidth: '240px' }}>
                          <div style={{ fontWeight: 900, color: isMemberLeader ? '#ffd700' : '#64748b', fontSize: '1rem', width: '22px' }}>
                            #{idx + 1}
                          </div>

                          <div className="member-avatar" style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '50%',
                            background: '#1e293b',
                            border: isMemberLeader ? '2px solid #ffd700' : '1px solid #ff8c00',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 900,
                            color: '#ffd700',
                            overflow: 'hidden',
                            flexShrink: 0
                          }}>
                            {member.avatar ? (
                              <img src={member.avatar} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <span style={{ fontSize: '1.1rem' }}>{member.name.charAt(0)}</span>
                            )}
                          </div>

                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                              <h4 style={{ margin: 0, color: '#f8fafc', fontSize: '0.98rem', fontWeight: 900 }}>{member.name}</h4>
                              {renderMemberRoleBadge(member, isMemberLeader)}
                            </div>
                            <p style={{ margin: '0.1rem 0 0 0', color: '#94a3b8', fontSize: '0.82rem', fontWeight: 600 }}>
                              🏍️ {member.motorcycle || 'Motocicleta no especificada'}
                            </p>
                          </div>
                        </div>

                        {/* 2. Slot: Correo Electrónico */}
                        {isClubMember && member.email ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                            <span style={{ fontSize: '0.68rem', color: '#ff8c00', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              ✉️ CORREO ELECTRÓNICO
                            </span>
                            <span style={{ fontSize: '0.85rem', color: '#f8fafc', fontWeight: 600 }}>
                              {member.email}
                            </span>
                          </div>
                        ) : <div />}

                        {/* 3. Slot: Teléfono de Contacto */}
                        {isClubMember && member.phone ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                            <span style={{ fontSize: '0.68rem', color: '#4ade80', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              📞 TELÉFONO DE CONTACTO
                            </span>
                            <span style={{ fontSize: '0.85rem', color: '#f8fafc', fontWeight: 600 }}>
                              {member.phone}
                            </span>
                          </div>
                        ) : <div />}

                        {/* 4. Slot: Fecha de Cumpleaños */}
                        {isClubMember && (member.birthDate || member.birthdate) ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                            <span style={{ fontSize: '0.68rem', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              🎂 FECHA DE CUMPLEAÑOS
                            </span>
                            <span style={{ fontSize: '0.85rem', color: '#f8fafc', fontWeight: 600 }}>
                              {formatDateLong(member.birthDate || member.birthdate)}
                            </span>
                          </div>
                        ) : <div />}

                        {/* 5. Slot: Placa (Privada para Líder o Dueño) */}
                        {canSeePlate && (member.plate || member.bikes?.[0]?.plate) ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                            <span style={{ fontSize: '0.68rem', color: '#ffd700', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              🔒 PLACA
                            </span>
                            <span style={{
                              display: 'inline-block',
                              background: 'rgba(255, 215, 0, 0.15)',
                              color: '#ffd700',
                              border: '1px solid rgba(255, 215, 0, 0.4)',
                              padding: '3px 9px',
                              borderRadius: '7px',
                              fontWeight: '900',
                              fontSize: '0.8rem',
                              width: 'fit-content'
                            }}>
                              {member.plate || member.bikes?.[0]?.plate}
                            </span>
                          </div>
                        ) : <div />}
                      </div>
                    );
                  })
                ) : (
                  <p className="no-members-text">Aún no hay miembros registrados públicamente en este club.</p>
                )}
              </div>
            </section>

      {/* Modal para que el Líder Agregue Miembros Directamente */}
      {showAddMemberModal && (
        <div className="modal-backdrop">
          <div className="add-member-modal-card">
            <div className="modal-header">
              <h2><PlusCircle size={20} className="gold-icon" /> AGREGAR MIEMBRO AL MOTO CLUB</h2>
              <p>Busca un biker registrado o ingresa su correo electrónico para integrarlo directamente a <strong>{club.name}</strong>.</p>
            </div>

            <div className="add-member-body">
              <div className="input-group" style={{ marginBottom: '1.2rem' }}>
                <label><Search size={14} /> Buscar Biker por Nombre de Usuario o Correo</label>
                <input 
                  type="text" 
                  placeholder="Escribe el nombre o correo del biker sin club..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Lista Desplegada de Usuarios Disponibles Sin Club */}
              <div className="available-bikers-container" style={{
                maxHeight: '260px',
                overflowY: 'auto',
                background: 'rgba(0, 0, 0, 0.4)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 140, 0, 0.2)',
                padding: '8px',
                marginBottom: '1.2rem'
              }}>
                <div style={{ padding: '6px 8px', fontSize: '0.8rem', color: '#ff8c00', fontWeight: '800', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>BIKERS REGISTRADOS DISPONIBLES (SIN CLUB)</span>
                  <span>{availableUsers.filter(u => !searchQuery.trim() || (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase())) || (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase()))).length} disponibles</span>
                </div>

                {loadingAvailableUsers ? (
                  <div style={{ textAlign: 'center', padding: '1.5rem', color: '#94a3b8', fontSize: '0.88rem' }}>
                    Cargando lista de bikers disponibles...
                  </div>
                ) : availableUsers.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '1.5rem', color: '#94a3b8', fontSize: '0.88rem' }}>
                    No hay otros bikers sin club disponibles en este momento.
                  </div>
                ) : (
                  (() => {
                    const filtered = availableUsers.filter(u => {
                      if (!searchQuery.trim()) return true;
                      const q = searchQuery.toLowerCase();
                      return (u.name && u.name.toLowerCase().includes(q)) || (u.email && u.email.toLowerCase().includes(q));
                    });

                    if (filtered.length === 0) {
                      return (
                        <div style={{ textAlign: 'center', padding: '1.5rem', color: '#94a3b8', fontSize: '0.88rem' }}>
                          No se encontraron bikers que coincidan con "{searchQuery}".
                        </div>
                      );
                    }

                    return filtered.map(u => (
                      <div key={u.id} className="search-user-item" style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        transition: 'background 0.2s',
                        marginBottom: '4px'
                      }}>
                        <div className="user-info" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div className="avatar-sm" style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '50%',
                            background: '#1e293b',
                            border: '1px solid #ff8c00',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '800',
                            color: '#ffd700',
                            overflow: 'hidden'
                          }}>
                            {u.avatar ? <img src={u.avatar} alt={u.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span>{u.name ? u.name.charAt(0) : 'U'}</span>}
                          </div>
                          <div>
                            <strong style={{ color: '#f8fafc', fontSize: '0.9rem', display: 'block' }}>{u.name}</strong>
                            <span className="email-sub" style={{ color: '#94a3b8', fontSize: '0.78rem' }}>{u.email}</span>
                          </div>
                        </div>
                        <button 
                          className="btn-select-user"
                          style={{
                            background: 'linear-gradient(135deg, #ff8c00, #e65c00)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '6px 14px',
                            fontWeight: '800',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            boxShadow: '0 2px 10px rgba(255, 140, 0, 0.3)'
                          }}
                          onClick={() => handleAddMemberByEmail(u.email)}
                          disabled={addingMember}
                        >
                          <UserCheck size={14} /> Integrar
                        </button>
                      </div>
                    ));
                  })()
                )}
              </div>

              <div className="divider-or" style={{ textAlign: 'center', margin: '1rem 0', color: '#64748b', fontSize: '0.8rem' }}>
                <span>O ingresa un correo directamente</span>
              </div>

              <div className="input-group">
                <label><Mail size={14} /> Correo Electrónico Manual *</label>
                <input 
                  type="email" 
                  placeholder="usuario@ejemplo.com"
                  value={memberEmailInput}
                  onChange={e => setMemberEmailInput(e.target.value)}
                />
              </div>

              <div className="modal-actions-bar" style={{ marginTop: '1.2rem', display: 'flex', justifyContent: 'flex-end', gap: '0.8rem' }}>
                <button type="button" className="btn-cancel" onClick={() => setShowAddMemberModal(false)}>
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className="btn-save-gold"
                  onClick={() => handleAddMemberByEmail(memberEmailInput)}
                  disabled={addingMember || !memberEmailInput.trim()}
                >
                  <UserPlus size={16} /> {addingMember ? 'Agregando...' : 'Agregar por Correo'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Reenvió de Pago Directo Nequi / Bre-B & PayPal USD */}
      {showPaymentModal && (
        <div className="modal-backdrop">
          <div className="subscription-modal-card nequi-modal">
            <div className="modal-header">
              <h2>REENVIAR COMPROBANTE DE SUSCRIPCIÓN</h2>
              <p>Envía tu nuevo comprobante de transferencia para activar la Insignia Dorada 👑 de <strong>{club.name}</strong>.</p>
            </div>

            <div className="payment-tabs-header">
              <button 
                type="button" 
                className={`tab-btn ${paymentMethod === 'nequi' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('nequi')}
              >
                🇨🇴 Colombia (Nequi / Bre-B)
              </button>
              <button 
                type="button" 
                className={`tab-btn ${paymentMethod === 'paypal' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('paypal')}
              >
                🌎 Internacional (PayPal USD / Tarjetas)
              </button>
            </div>

            <div className="plans-selection">
              <div 
                className={`plan-card ${selectedPlan === 'monthly' ? 'selected' : ''}`}
                onClick={() => setSelectedPlan('monthly')}
              >
                <div className="plan-radio"></div>
                <div className="plan-details">
                  <h3>Plan Rider Club (Mensual)</h3>
                  <div className="plan-price">
                    {paymentMethod === 'nequi' ? '$29.900 COP' : '$10.00 USD'} <span>/ mes</span>
                  </div>
                </div>
              </div>

              <div 
                className={`plan-card featured ${selectedPlan === 'annual' ? 'selected' : ''}`}
                onClick={() => setSelectedPlan('annual')}
              >
                <span className="best-value-badge"><Sparkles size={12} /> MÁS POPULAR</span>
                <div className="plan-radio"></div>
                <div className="plan-details">
                  <h3>Plan Leyenda M.C. (Anual)</h3>
                  <div className="plan-price">
                    {paymentMethod === 'nequi' ? '$249.900 COP' : '$100.00 USD'} <span>/ año</span>
                  </div>
                  <p className="plan-savings">Incluye 2 meses GRATIS + Insignia Dorada VIP</p>
                </div>
              </div>
            </div>

            {paymentMethod === 'nequi' && (
              <div className="nequi-info-box">
                <div className="nequi-box-header">
                  <h4>DATOS DE TRANSFERENCIA COLOMBIA (COP)</h4>
                  <span className="nequi-badge-small">Nequi & Bre-B</span>
                </div>
                <div className="nequi-detail-row">
                  <span className="label">Número Nequi / Llave Bre-B:</span>
                  <div className="number-copy-group">
                    <span className="number">318 550 3428</span>
                    <button type="button" className="btn-copy" onClick={copyNequi}>
                      {copiedNequi ? <Check size={14} className="copied" /> : <Copy size={14} />} {copiedNequi ? '¡Copiado!' : 'Copiar'}
                    </button>
                  </div>
                </div>
                <div className="nequi-detail-row">
                  <span className="label">Titular de la Cuenta:</span>
                  <span className="val-holder">Wilmer Rojas</span>
                </div>
              </div>
            )}

            {paymentMethod === 'paypal' && (
              <div className="paypal-info-box">
                <div className="nequi-box-header">
                  <h4>DATOS DE PAGO INTERNACIONAL (USD)</h4>
                  <span className="paypal-badge-small">PayPal & Credit Cards</span>
                </div>
                <div className="nequi-detail-row">
                  <span className="label">Enlace Directo de Pago:</span>
                  <a 
                    href={`https://paypal.me/wilmer7522/${selectedPlan === 'annual' ? '100' : '10'}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-paypal-link"
                  >
                    Abrir PayPal.me/wilmer7522 <ExternalLink size={14} />
                  </a>
                </div>
                <div className="nequi-detail-row">
                  <span className="label">Correo / Usuario PayPal:</span>
                  <div className="number-copy-group">
                    <span className="number-sm">wilmer7522@gmail.com</span>
                    <button type="button" className="btn-copy" onClick={copyPaypal}>
                      {copiedPaypal ? <Check size={14} className="copied" /> : <Copy size={14} />} {copiedPaypal ? '¡Copiado!' : 'Copiar'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="payment-proof-fields">
              <div className="input-group">
                <label><FileText size={14} /> Número / ID de Transacción * (Obligatorio)</label>
                <input 
                  type="text" 
                  placeholder={paymentMethod === 'nequi' ? "Ej. M10928374 (Nequi / Bre-B)" : "Ej. 9AB12345CD67890 (PayPal Transaction ID)"}
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label><Upload size={14} /> Adjuntar Captura de Pantalla del Comprobante * (Temporal)</label>
                
                <label className="custom-file-upload-box">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleProofImageFileChange}
                  />
                  <div className="upload-box-content">
                    <Upload size={18} className="upload-icon" />
                    <span>
                      {proofFileName 
                        ? `✓ Comprobante seleccionado: ${proofFileName}` 
                        : 'Seleccionar imagen del comprobante (.png, .jpg)'}
                    </span>
                  </div>
                </label>

                {proofImageBase64 && (
                  <div className="proof-preview-box">
                    <span className="preview-label">Vista Previa del Comprobante:</span>
                    <img src={proofImageBase64} alt="Comprobante de pago" className="proof-thumbnail" />
                  </div>
                )}
              </div>
            </div>

            <div className="modal-actions" style={{ display: 'flex', gap: '1rem' }}>
              <button 
                type="button"
                className="btn-cancel" 
                onClick={() => setShowPaymentModal(false)}
                style={{ width: 'auto' }}
              >
                Cancelar
              </button>

              <button 
                type="button"
                className="btn-pay-now nequi-btn" 
                onClick={handleResubmitPayment} 
                disabled={submittingPayment}
                style={{ flex: 1 }}
              >
                <Send size={16} /> {submittingPayment ? 'Enviando Datos...' : 'Enviar Comprobante a Verificación'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Gestión de Miembros y Cargos para el Líder */}
      {showManageMembersModal && club && (
        <div className="modal-backdrop">
          <div className="add-member-modal-card" style={{ maxWidth: '620px', width: '92%' }}>
            <div className="modal-header">
              <h2><Award size={20} className="gold-icon" /> GESTIÓN DE MIEMBROS Y CARGOS</h2>
              <p>Asigna cargos oficiales, jerarquías o desvincula integrantes de <strong>{club.name}</strong>.</p>
            </div>

            <div className="add-member-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
                {club.members && club.members.map((member) => {
                  const isMemberLeader = String(member.id) === String(club.leaderId);
                  return (
                    <div key={member.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: '#0f172a',
                      border: isMemberLeader ? '1px solid rgba(255, 215, 0, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '12px',
                      padding: '10px 14px',
                      gap: '0.8rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <div className="member-avatar" style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '50%',
                          background: '#1e293b',
                          border: isMemberLeader ? '2px solid #ffd700' : '1px solid #ff8c00',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 900,
                          color: '#ffd700',
                          overflow: 'hidden',
                          flexShrink: 0
                        }}>
                          {member.avatar ? (
                            <img src={member.avatar} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <span>{member.name.charAt(0)}</span>
                          )}
                        </div>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <h4 style={{ margin: 0, color: '#f8fafc', fontSize: '0.92rem', fontWeight: 800 }}>{member.name}</h4>
                            {renderMemberRoleBadge(member, isMemberLeader)}
                          </div>
                          <p style={{ margin: '0.1rem 0 0 0', color: '#94a3b8', fontSize: '0.78rem' }}>
                            ✉️ {member.email}
                          </p>
                        </div>
                      </div>

                      {!isMemberLeader ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
                          <button
                            type="button"
                            style={{
                              background: 'rgba(168, 85, 247, 0.15)',
                              color: '#c084fc',
                              border: '1px solid #a855f7',
                              borderRadius: '8px',
                              padding: '6px 10px',
                              fontWeight: 800,
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.3rem'
                            }}
                            onClick={() => {
                              setTargetMember(member);
                              setSelectedRolePreset(member.clubRole || 'Miembro Oficial');
                              setCustomRoleInput(member.clubRole || '');
                              setShowRoleModal(true);
                            }}
                          >
                            <Award size={13} /> Cargo
                          </button>
                          <button
                            type="button"
                            style={{
                              background: 'rgba(239, 68, 68, 0.15)',
                              color: '#ef4444',
                              border: '1px solid #ef4444',
                              borderRadius: '8px',
                              padding: '6px 10px',
                              fontWeight: 800,
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.3rem'
                            }}
                            onClick={() => handleRemoveMember(member.id, member.name)}
                          >
                            <Trash2 size={13} /> Desvincular
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#ffd700', fontWeight: 800 }}>Fundador</span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: '1.2rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowManageMembersModal(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para que el Líder Asigne Cargos a un Miembro */}
      {showRoleModal && targetMember && (
        <div className="modal-backdrop">
          <div className="add-member-modal-card" style={{ maxWidth: '460px' }}>
            <div className="modal-header">
              <h2><Award size={20} className="gold-icon" /> ASIGNAR CARGO / RANGO DE CLUB</h2>
              <p>Asigna un cargo oficial o jerarquía a <strong>{targetMember.name}</strong> dentro del club.</p>
              <button className="btn-close-modal" onClick={() => setShowRoleModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="add-member-body">
              <div style={{ marginBottom: '1.2rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#ff8c00', fontWeight: 800, marginBottom: '0.5rem' }}>
                  SELECCIONA EL CARGO OFICIAL:
                </label>
                <select
                  value={PRESET_CLUB_ROLES.some(p => p.id === selectedRolePreset) ? selectedRolePreset : 'CUSTOM'}
                  onChange={(e) => {
                    setSelectedRolePreset(e.target.value);
                    if (e.target.value !== 'CUSTOM') {
                      setCustomRoleInput('');
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: '#0f172a',
                    border: '1px solid rgba(255, 140, 0, 0.4)',
                    borderRadius: '10px',
                    color: '#f8fafc',
                    fontWeight: 800,
                    fontSize: '0.9rem'
                  }}
                >
                  {PRESET_CLUB_ROLES.map(role => (
                    <option key={role.id} value={role.id}>{role.label}</option>
                  ))}
                </select>
              </div>

              {(selectedRolePreset === 'CUSTOM' || !PRESET_CLUB_ROLES.some(p => p.id === selectedRolePreset)) && (
                <div style={{ marginBottom: '1.2rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#f472b6', fontWeight: 800, marginBottom: '0.4rem' }}>
                    ✍️ ESCRIBE EL CARGO PERSONALIZADO:
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Mecánico Oficial, Fotógrafo, Coordinador..."
                    value={customRoleInput}
                    onChange={(e) => setCustomRoleInput(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: '#0f172a',
                      border: '1px solid rgba(244, 114, 182, 0.5)',
                      borderRadius: '10px',
                      color: '#f8fafc',
                      fontWeight: 700,
                      fontSize: '0.9rem'
                    }}
                  />
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowRoleModal(false)}
                  disabled={roleSaving}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn-save-gold"
                  onClick={handleSaveMemberRole}
                  disabled={roleSaving}
                >
                  <Award size={16} /> {roleSaving ? 'Guardando...' : 'Guardar Cargo'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Editar Información del Moto Club */}
      {showEditModal && club && (
        <div className="modal-backdrop">
          <div className="add-member-modal-card" style={{ maxWidth: '680px', width: '94%', maxHeight: '88vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <h2><Edit3 size={20} className="gold-icon" /> EDITAR INFORMACIÓN DEL MOTO CLUB</h2>
              <p>Actualiza los detalles oficiales, escudos, banners y datos de contacto de <strong>{club.name}</strong>.</p>
            </div>

            <div className="add-member-body">
              <form onSubmit={handleSaveEdit} className="club-edit-form">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem' }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', color: '#ff8c00', fontWeight: 800, fontSize: '0.8rem' }}>
                      NOMBRE DEL MOTO CLUB *
                    </label>
                    <input 
                      type="text" 
                      value={editFormData?.name || ''} 
                      onChange={e => setEditFormData({...editFormData, name: e.target.value})}
                      required
                      style={{ width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px', color: '#fff', fontWeight: 700 }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem', color: '#ff8c00', fontWeight: 800, fontSize: '0.8rem' }}>
                      <Globe size={14} /> PAÍS SEDE *
                    </label>
                    <select 
                      value={editFormData?.countryCode || ''} 
                      onChange={handleCountryChange} 
                      required
                      style={{ width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px', color: '#fff', fontWeight: 700 }}
                    >
                      <option value="">Selecciona un país</option>
                      {(allCountries || []).map(c => (
                        <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem', color: '#ff8c00', fontWeight: 800, fontSize: '0.8rem' }}>
                      <Building size={14} /> CIUDAD SEDE *
                    </label>
                    <select 
                      value={editFormData?.city || ''} 
                      onChange={e => setEditFormData({...editFormData, city: e.target.value})}
                      required
                      style={{ width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px', color: '#fff', fontWeight: 700 }}
                    >
                      <option value="">Selecciona una ciudad</option>
                      {(cities || []).map((c, idx) => (
                        <option key={`${c.name}-${idx}`} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Escudo / Logo Input */}
                  <div style={{ gridColumn: '1 / -1' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#ff8c00', fontWeight: 800, fontSize: '0.8rem' }}>
                        <ImageIcon size={14} /> ESCUDO / LOGO DEL CLUB (PNG/JPG)
                      </label>
                      <div style={{ display: 'flex', gap: '0.3rem' }}>
                        <button 
                          type="button" 
                          onClick={() => setLogoInputType('file')}
                          style={{ padding: '3px 9px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', background: logoInputType === 'file' ? '#ff8c00' : '#1e293b', color: '#fff', border: 'none' }}
                        >
                          <Upload size={12} /> Subir Archivo
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setLogoInputType('url')}
                          style={{ padding: '3px 9px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', background: logoInputType === 'url' ? '#ff8c00' : '#1e293b', color: '#fff', border: 'none' }}
                        >
                          <LinkIcon size={12} /> Pegar URL
                        </button>
                      </div>
                    </div>

                    {logoInputType === 'file' ? (
                      <label style={{ display: 'block', width: '100%', cursor: 'pointer' }}>
                        <input 
                          type="file" 
                          accept="image/png, image/jpeg, image/jpg, image/webp"
                          onChange={(e) => handleFileUpload(e, 'logo')}
                          style={{ display: 'none' }}
                        />
                        <div style={{ background: '#0f172a', border: '1px dashed #ff8c00', borderRadius: '10px', padding: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1', fontSize: '0.85rem', fontWeight: 700 }}>
                          <Upload size={18} style={{ color: '#ff8c00' }} />
                          <span>
                            {logoFileName 
                              ? `✓ Archivo seleccionado: ${logoFileName}` 
                              : 'Seleccionar archivo de imagen (.png, .jpg)'}
                          </span>
                        </div>
                      </label>
                    ) : (
                      <input 
                        type="url" 
                        placeholder="https://ejemplo.com/escudo.png"
                        value={editFormData?.logo || ''} 
                        onChange={e => setEditFormData({...editFormData, logo: e.target.value})}
                        style={{ width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px', color: '#fff', fontWeight: 700 }}
                      />
                    )}

                    {editFormData?.logo && (
                      <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Vista previa del Escudo:</span>
                        <img src={editFormData.logo} alt="Escudo preview" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #ff8c00' }} />
                      </div>
                    )}
                  </div>

                  {/* Portada / Banner Input */}
                  <div style={{ gridColumn: '1 / -1' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#ff8c00', fontWeight: 800, fontSize: '0.8rem' }}>
                        <ImageIcon size={14} /> PORTADA / BANNER DEL CLUB (PNG/JPG)
                      </label>
                      <div style={{ display: 'flex', gap: '0.3rem' }}>
                        <button 
                          type="button" 
                          onClick={() => setBannerInputType('file')}
                          style={{ padding: '3px 9px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', background: bannerInputType === 'file' ? '#ff8c00' : '#1e293b', color: '#fff', border: 'none' }}
                        >
                          <Upload size={12} /> Subir Archivo
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setBannerInputType('url')}
                          style={{ padding: '3px 9px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', background: bannerInputType === 'url' ? '#ff8c00' : '#1e293b', color: '#fff', border: 'none' }}
                        >
                          <LinkIcon size={12} /> Pegar URL
                        </button>
                      </div>
                    </div>

                    {bannerInputType === 'file' ? (
                      <label style={{ display: 'block', width: '100%', cursor: 'pointer' }}>
                        <input 
                          type="file" 
                          accept="image/png, image/jpeg, image/jpg, image/webp"
                          onChange={(e) => handleFileUpload(e, 'banner')}
                          style={{ display: 'none' }}
                        />
                        <div style={{ background: '#0f172a', border: '1px dashed #ff8c00', borderRadius: '10px', padding: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1', fontSize: '0.85rem', fontWeight: 700 }}>
                          <Upload size={18} style={{ color: '#ff8c00' }} />
                          <span>
                            {bannerFileName 
                              ? `✓ Archivo seleccionado: ${bannerFileName}` 
                              : 'Seleccionar archivo de portada (.png, .jpg)'}
                          </span>
                        </div>
                      </label>
                    ) : (
                      <input 
                        type="url" 
                        placeholder="https://ejemplo.com/portada.jpg"
                        value={editFormData?.banner || ''} 
                        onChange={e => setEditFormData({...editFormData, banner: e.target.value})}
                        style={{ width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px', color: '#fff', fontWeight: 700 }}
                      />
                    )}

                    {editFormData?.banner && (
                      <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Vista previa de Portada:</span>
                        <img src={editFormData.banner} alt="Banner preview" style={{ width: '120px', height: '45px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #ff8c00' }} />
                      </div>
                    )}
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', color: '#ff8c00', fontWeight: 800, fontSize: '0.8rem' }}>
                      DESCRIPCIÓN / HISTORIA DEL CLUB
                    </label>
                    <textarea 
                      rows={4}
                      value={editFormData?.description || ''} 
                      onChange={e => setEditFormData({...editFormData, description: e.target.value})}
                      style={{ width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px', color: '#fff', fontWeight: 600, resize: 'vertical' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem', color: '#ff8c00', fontWeight: 800, fontSize: '0.8rem' }}>
                      <MessageSquare size={14} /> ENLACE GRUPO DE WHATSAPP
                    </label>
                    <input 
                      type="url" 
                      value={editFormData?.whatsappGroup || ''} 
                      onChange={e => setEditFormData({...editFormData, whatsappGroup: e.target.value})}
                      placeholder="https://chat.whatsapp.com/..."
                      style={{ width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px', color: '#fff', fontWeight: 700 }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem', color: '#ff8c00', fontWeight: 800, fontSize: '0.8rem' }}>
                      <Instagram size={14} /> INSTAGRAM DEL CLUB
                    </label>
                    <input 
                      type="text" 
                      value={editFormData?.instagram || ''} 
                      onChange={e => setEditFormData({...editFormData, instagram: e.target.value})}
                      placeholder="@micluboficial"
                      style={{ width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px', color: '#fff', fontWeight: 700 }}
                    />
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.8rem' }}>
                  <button type="button" className="btn-cancel" onClick={() => setShowEditModal(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn-save-gold" disabled={saveLoading}>
                    <Save size={16} /> {saveLoading ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
};

export default ClubDetail;
