import React, { useState, useEffect } from 'react';
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Button, 
    TextField, 
    Select, 
    MenuItem, 
    FormControl, 
    InputLabel, 
    Grid, 
    Typography, 
    Chip,
    Box,
    IconButton,
    Alert,
    CircularProgress
} from '@mui/material';
import { 
    Close as CloseIcon,
    Save as SaveIcon,
    Person as PersonIcon,
    EmojiEvents as CrownIcon,
    Settings as SettingsIcon
} from '@mui/icons-material';
import axios from '../../../utils/axiosConfig';

const AdminManagementDetail = ({ open, onClose, selectedUser, currentUser, onUserUpdated }) => {
    const [userDetail, setUserDetail] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [alert, setAlert] = useState({ show: false, message: '', severity: 'info' });

    // 구독 마감일자만 수정 가능 (A, B 권한)
    const canEditSubscription = () => {
        const currentUserType = currentUser?.userType || currentUser?.user_type;
        return currentUserType === 'A' || currentUserType === 'B';
    };

    // 권한 변경 가능 여부 (A권한만)
    const canChangeAuthority = () => {
        const currentUserType = currentUser?.userType || currentUser?.user_type;
        return currentUserType === 'A';
    };

    // 탈퇴/복구 가능 여부 (A, B 권한)
    const canManageStatus = () => {
        const currentUserType = currentUser?.userType || currentUser?.user_type;
        return currentUserType === 'A' || currentUserType === 'B';
    };

    // 선택된 유저가 변경될 때마다 상세 정보 조회
    useEffect(() => {
        if (open && selectedUser?.login_id) {
            fetchUserDetail(selectedUser.login_id);
        }
    }, [open, selectedUser]);

    // 🔍 사용자 상세 정보 조회
    const fetchUserDetail = async (loginId) => {
        setIsLoading(true);
        
        try {
            const userData = await axios.get(`/api/admin/customers/${loginId}`);
            setUserDetail(userData);
            
            // 편집 폼 초기화
            setEditForm({
                user_name: userData.user_name || '',
                sex: userData.sex || '',
                birthday: userData.birthday || '',
                hp: formatPhoneNumber(userData.hp) || '',
                address: userData.address || '',
                hobby: userData.hobby || '',
                note: userData.note || userData.notes || '',
                expire_days: userData.expire_days || '' // 구독 마감일자 추가
            });
            
            console.log('🔍 사용자 데이터:', userData);
            
        } catch (error) {
            console.error('❌ 사용자 정보 조회 실패:', error);
            showAlert('사용자 정보를 불러오는데 실패했습니다.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // 📱 전화번호 포맷팅 함수들
    const formatPhoneNumber = (phone) => {
        if (!phone) return '';
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length <= 3) return cleaned;
        else if (cleaned.length <= 7) 
            return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
        else if (cleaned.length <= 11) 
            return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
        return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 11)}`;
    };

    // 📅 날짜 포맷팅 함수
    const formatDateTime = (dateString) => {
        if (!dateString) return '없음';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    // 🚨 알림 표시
    const showAlert = (message, severity = 'info') => {
        setAlert({ show: true, message, severity });
        setTimeout(() => setAlert({ show: false, message: '', severity: 'info' }), 5000);
    };

    // 💾 구독 마감일자만 저장
    const saveSubscriptionExpiry = async () => {
        if (!userDetail) return;

        try {
            const updateData = {
                expire_days: editForm.expire_days || null
            };

            console.log('💾 저장할 데이터:', updateData);

            await axios.put(`/api/admin/customers/${userDetail.login_id}`, updateData);
            showAlert('구독 마감일자가 성공적으로 저장되었습니다.', 'success');
            
            await fetchUserDetail(userDetail.login_id);
            
            if (onUserUpdated) {
                onUserUpdated();
            }
        } catch (error) {
            console.error('❌ 구독 마감일자 저장 실패:', error);
            showAlert('구독 마감일자 저장에 실패했습니다.', 'error');
        }
    };

    // 👑 권한 변경
    const changeUserAuthority = async (newAuthority) => {
        if (!canChangeAuthority()) {
            showAlert('권한 변경은 슈퍼관리자(A)만 가능합니다.', 'error');
            return;
        }

        if (!window.confirm(`사용자의 권한을 ${newAuthority === 'B' ? '관리자' : '일반회원'}로 변경하시겠습니까?`)) {
            return;
        }

        try {
            await axios.patch(`/api/admin/customers/${userDetail.login_id}/change-authority`, {
                user_type: newAuthority
            });
            
            showAlert(`권한이 ${newAuthority === 'B' ? '관리자' : '일반회원'}로 변경되었습니다.`, 'success');
            
            await fetchUserDetail(userDetail.login_id);
            
            if (onUserUpdated) {
                onUserUpdated();
            }
        } catch (error) {
            console.error('❌ 권한 변경 실패:', error);
            showAlert('권한 변경에 실패했습니다.', 'error');
        }
    };

    // 🚫 탈퇴 처리
    const withdrawUser = async () => {
        if (!window.confirm('정말로 이 사용자를 탈퇴 처리하시겠습니까?')) {
            return;
        }

        try {
            await axios.patch(`/api/admin/customers/${userDetail.login_id}/withdraw`);
            showAlert('사용자가 탈퇴 처리되었습니다.', 'success');
            
            await fetchUserDetail(userDetail.login_id);
            
            if (onUserUpdated) {
                onUserUpdated();
            }
        } catch (error) {
            console.error('❌ 탈퇴 처리 실패:', error);
            showAlert('탈퇴 처리에 실패했습니다.', 'error');
        }
    };

    // 🔄 탈퇴 복구
    const restoreUser = async () => {
        if (!window.confirm('정말로 이 사용자를 복구하시겠습니까?')) {
            return;
        }

        try {
            await axios.patch(`/api/admin/customers/${userDetail.login_id}/restore`);
            showAlert('사용자가 복구되었습니다.', 'success');
            
            await fetchUserDetail(userDetail.login_id);
            
            if (onUserUpdated) {
                onUserUpdated();
            }
        } catch (error) {
            console.error('❌ 사용자 복구 실패:', error);
            showAlert('사용자 복구에 실패했습니다.', 'error');
        }
    };

    // 입력 필드 변경 핸들러 (구독 마감일자만)
    const handleInputChange = (field, value) => {
        if (field === 'expire_days') {
            setEditForm(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    // 🔥 성별 표시 변환 (M → 남성, F/W → 여성)
    const getDisplaySex = (sex) => {
        if (sex === 'M') return '남성';
        if (sex === 'F' || sex === 'W') return '여성';
        return '';
    };

    // 권한 칩 렌더링
    const renderAuthorityChip = (userType) => {
        if (userType === 'A') {
            return <Chip 
                label="슈퍼관리자" 
                icon={<CrownIcon fontSize="small" />} 
                sx={{ bgcolor: '#FFD700', color: '#333', fontWeight: 'bold' }}
                clickable={false}
            />;
        } else if (userType === 'B') {
            return <Chip 
                label="관리자" 
                icon={<SettingsIcon fontSize="small" />} 
                sx={{ bgcolor: '#90CAF9', color: '#333', fontWeight: 'bold' }}
                clickable={false}
            />;
        } else {
            return <Chip 
                label="일반회원" 
                icon={<PersonIcon fontSize="small" />} 
                sx={{ bgcolor: '#E0E0E0', color: '#333', fontWeight: 'bold' }}
                clickable={false}
            />;
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <PersonIcon />
                    <Typography variant="h6">사용자 정보</Typography>
                    {userDetail && renderAuthorityChip(userDetail.user_type)}
                </Box>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                {/* 알림 메시지 */}
                {alert.show && (
                    <Alert severity={alert.severity} sx={{ mb: 2 }}>
                        {alert.message}
                    </Alert>
                )}

                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <CircularProgress />
                        <Typography sx={{ ml: 2 }}>로딩 중...</Typography>
                    </Box>
                ) : userDetail ? (
                    <Grid container spacing={2}>
                        {/* 1행 - 기본 정보 */}
                        <Grid item xs={12} sm={4}>
                            <TextField label="회원번호" value={userDetail.user_no || ''} fullWidth disabled size="small" />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField label="아이디 (이메일)" value={userDetail.login_id || ''} fullWidth disabled size="small" />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField label="가입일" value={userDetail.reg_date || ''} fullWidth disabled size="small" />
                        </Grid>

                        {/* 2행 - 개인 정보 (모두 비활성화) */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="이름"
                                value={editForm.user_name || ''}
                                fullWidth
                                disabled={true}
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={5}>
                            <FormControl fullWidth disabled={true} size="small">
                                <InputLabel id="gender-select-label">성별</InputLabel>
                                <Select
                                    labelId="gender-select-label"
                                    value={getDisplaySex(editForm.sex)}
                                    label="성별"
                                    sx={{ 
                                        minWidth: '120px',
                                        '& .MuiSelect-select': {
                                            paddingY: '8.5px'
                                        }
                                    }}
                                >
                                    <MenuItem value="남성">남성</MenuItem>
                                    <MenuItem value="여성">여성</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                label="생년월일"
                                type="date"
                                value={editForm.birthday || ''}
                                fullWidth
                                disabled={true}
                                InputLabelProps={{ shrink: true }}
                                size="small"
                            />
                        </Grid>

                        {/* 3행 - 연락처 & 구독 마감일자 */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="전화번호"
                                value={editForm.hp || ''}
                                fullWidth
                                disabled={true}
                                placeholder="010-0000-0000"
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="구독 마감일자"
                                type="date"
                                value={editForm.expire_days || ''}
                                onChange={(e) => handleInputChange('expire_days', e.target.value)}
                                fullWidth
                                disabled={!canEditSubscription()}
                                InputLabelProps={{ shrink: true }}
                                size="small"
                            />
                        </Grid>
                        
                        {/* 4행 - 탈퇴일 */}
                        <Grid item xs={12}>
                            <TextField 
                                label="탈퇴일" 
                                value={formatDateTime(userDetail.withdrawal_date)} 
                                fullWidth 
                                disabled 
                                size="small" 
                            />
                        </Grid>
                        
                        {/* 5행 - 주소 (비활성화) */}
                        <Grid item xs={12}>
                            <TextField
                                label="주소"
                                value={editForm.address || ''}
                                fullWidth
                                disabled={true}
                                size="small"
                                placeholder="주소는 수정할 수 없습니다"
                            />
                        </Grid>

                        {/* 6행 - 취미 & 특이사항 (비활성화) */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="취미/특기"
                                value={editForm.hobby || ''}
                                fullWidth
                                disabled={true}
                                multiline
                                rows={3}
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="특이사항"
                                value={editForm.note || ''}
                                fullWidth
                                disabled={true}
                                multiline
                                rows={3}
                                size="small"
                                placeholder="특이사항은 수정할 수 없습니다"
                            />
                        </Grid>

                        {/* 7행 - 관리 기능들 */}
                        <Grid item xs={12} sx={{ mt: 2 }}>
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                                {/* 권한 변경 (A권한만 가능, A권한 사용자는 제외) */}
                                {canChangeAuthority() && userDetail.user_type !== 'A' && (
                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                        <Typography variant="body2">권한:</Typography>
                                        <FormControl size="small" sx={{ minWidth: '100px' }}>
                                            <Select
                                                value={userDetail.user_type || ''}
                                                onChange={(e) => changeUserAuthority(e.target.value)}
                                            >
                                                <MenuItem value="B">관리자</MenuItem>
                                                <MenuItem value="C">일반회원</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Box>
                                )}

                                {/* 계정 상태 관리 */}
                                <Box 
                                    sx={{ 
                                        display: 'flex', 
                                        gap: 1, 
                                        alignItems: 'center'
                                    }}
                                >
                                    <Typography variant="body2">계정:</Typography>
                                    <Chip 
                                        label={userDetail.status_yn === 'Y' ? '탈퇴' : '정상'} 
                                        color={userDetail.status_yn === 'Y' ? 'error' : 'success'} 
                                        size="small"
                                        clickable={false}
                                        sx={{ 
                                            cursor: 'default',
                                            pointerEvents: 'none'
                                        }}
                                    />
                                    {canManageStatus() && (
                                        <>
                                            {userDetail.status_yn === 'Y' ? (
                                                <Button 
                                                    variant="contained" 
                                                    color="success" 
                                                    onClick={restoreUser} 
                                                    size="small"
                                                >
                                                    복구
                                                </Button>
                                            ) : (
                                                <Button 
                                                    variant="outlined" 
                                                    color="error" 
                                                    onClick={withdrawUser} 
                                                    size="small"
                                                >
                                                    탈퇴
                                                </Button>
                                            )}
                                        </>
                                    )}
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                ) : (
                    <Typography variant="body1" color="text.secondary">
                        사용자 정보를 불러올 수 없습니다.
                    </Typography>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                {canEditSubscription() && (
                    <Button 
                        onClick={saveSubscriptionExpiry} 
                        variant="contained"
                        startIcon={<SaveIcon />}
                        color="primary"
                    >
                    저장
                    </Button>
                )}
                <Button onClick={onClose} variant="outlined">
                    닫기
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AdminManagementDetail;