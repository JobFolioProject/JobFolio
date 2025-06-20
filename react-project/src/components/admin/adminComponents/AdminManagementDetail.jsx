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

    const canEdit = () => {
        const currentUserType = currentUser?.userType || currentUser?.user_type;
        return currentUserType === 'A' || currentUserType === 'B';
    };

    const canChangeAuthority = () => {
        const currentUserType = currentUser?.userType || currentUser?.user_type;
        return currentUserType === 'A';
    };

    useEffect(() => {
        if (open && selectedUser?.login_id) {
            fetchUserDetail(selectedUser.login_id);
        }
    }, [open, selectedUser]);



    const fetchUserDetail = async (loginId) => {
        setIsLoading(true);
        
        try {
            const userData = await axios.get(`/api/admin/customers/${loginId}`);
            setUserDetail(userData);
            
            setEditForm({
                user_name: userData.user_name || '',
                sex: userData.sex || '',
                birthday: userData.birthday || '',
                hp: formatPhoneNumber(userData.hp) || '',
                address: userData.address || '', 
                hobby: userData.hobby || '',
                note: (userData.note === null || userData.note === undefined) ? '' : userData.note // null/undefined 체크 강화
            });
        } catch (error) {
            showAlert('사용자 정보를 불러오는데 실패했습니다.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

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

    const removePhoneFormat = (phone) => {
        return phone ? phone.replace(/\D/g, '') : '';
    };

    const validatePhoneNumber = (phone) => {
        if (!phone) return '';
        const numbers = phone.replace(/[^0-9]/g, '');
        if (!numbers.startsWith('010')) return '010으로 시작하는 번호만 입력 가능합니다.';
        if (numbers.length !== 11) return '휴대폰번호는 11자리여야 합니다.';
        return '';
    };

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

    const handleAddressSearch = () => {
        new window.daum.Postcode({
            oncomplete: function (data) {
                let fullAddress = data.roadAddress; 

                if (data.buildingName) {
                    fullAddress += ` (${data.buildingName})`;
                }

                fullAddress = `(${data.zonecode}) ${fullAddress}`;

                handleInputChange('address', fullAddress);
                
                setTimeout(() => {
                    const addressInput = document.querySelector('input[label="주소"]');
                    if (addressInput) {
                        addressInput.focus();
                        addressInput.setSelectionRange(addressInput.value.length, addressInput.value.length);
                    }
                }, 100);
            },
        }).open();
    };

    const showAlert = (message, severity = 'info') => {
        setAlert({ show: true, message, severity });
        setTimeout(() => setAlert({ show: false, message: '', severity: 'info' }), 5000);
    };

    const saveAllChanges = async () => {
        if (!userDetail) return;

        try {
            const updateData = {
                user_name: editForm.user_name,
                sex: editForm.sex, 
                birthday: editForm.birthday,
                hp: removePhoneFormat(editForm.hp), 
                address: editForm.address,
                hobby: editForm.hobby,
                note: editForm.note || null 
            };


            await axios.put(`/api/admin/customers/${userDetail.login_id}`, updateData);
            showAlert('사용자 정보가 성공적으로 저장되었습니다.', 'success');
            
            await fetchUserDetail(userDetail.login_id);
            
            if (onUserUpdated) {
                onUserUpdated();
            }
        } catch (error) {
            showAlert('정보 저장에 실패했습니다.', 'error');
        }
    };

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
            
            // 상세 정보 다시 조회
            await fetchUserDetail(userDetail.login_id);
            
            // 부모 컴포넌트의 목록도 새로고침
            if (onUserUpdated) {
                onUserUpdated();
            }
        } catch (error) {
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
            
            // 상세 정보 다시 조회
            await fetchUserDetail(userDetail.login_id);
            
            // 부모 컴포넌트의 목록도 새로고침
            if (onUserUpdated) {
                onUserUpdated();
            }
        } catch (error) {
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
            
            // 상세 정보 다시 조회
            await fetchUserDetail(userDetail.login_id);
            
            // 부모 컴포넌트의 목록도 새로고침
            if (onUserUpdated) {
                onUserUpdated();
            }
        } catch (error) {
            showAlert('사용자 복구에 실패했습니다.', 'error');
        }
    };

    // 입력 필드 변경 핸들러
    const handleInputChange = (field, value) => {
        if (field === 'hp') {
            const formattedPhone = formatPhoneNumber(value);
            setEditForm(prev => ({
                ...prev,
                [field]: formattedPhone
            }));
        } else {
            setEditForm(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const getDisplaySex = (sex) => {
        if (sex === 'M') return '남성';
        if (sex === 'F' || sex === 'W') return '여성';
        if (sex === '남성') return '남성';
        if (sex === '여성') return '여성';
        return '';
    };

    const renderAuthorityChip = (userType) => {
        if (userType === 'A') {
            return <Chip 
                label="슈퍼관리자" 
                icon={<CrownIcon fontSize="small" />} 
                sx={{ bgcolor: '#FFD700', color: '#333', fontWeight: 'bold' }}
                clickable={false}
                onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
            />;
        } else if (userType === 'B') {
            return <Chip 
                label="관리자" 
                icon={<SettingsIcon fontSize="small" />} 
                sx={{ bgcolor: '#90CAF9', color: '#333', fontWeight: 'bold' }}
                clickable={false}
                onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
            />;
        } else {
            return <Chip 
                label="일반회원" 
                icon={<PersonIcon fontSize="small" />} 
                sx={{ bgcolor: '#E0E0E0', color: '#333', fontWeight: 'bold' }}
                clickable={false}
                onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
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

                        {/* 2행 - 개인 정보 */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="이름"
                                value={editForm.user_name || ''}
                                onChange={(e) => handleInputChange('user_name', e.target.value)}
                                fullWidth
                                disabled={!canEdit()}
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={5}>
                            <FormControl fullWidth disabled={!canEdit()} size="small">
                                <InputLabel id="gender-select-label">성별</InputLabel>
                                <Select
                                    labelId="gender-select-label"
                                    value={getDisplaySex(editForm.sex)}
                                    onChange={(e) => {
                                        const selectedValue = e.target.value;
                                        let englishValue = selectedValue;
                                        
                                        if (selectedValue === '남성') {
                                            englishValue = 'M';
                                        } else if (selectedValue === '여성') {
                                            englishValue = 'W';
                                        }
                                        
                                        handleInputChange('sex', englishValue);
                                    }}
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
                                onChange={(e) => handleInputChange('birthday', e.target.value)}
                                fullWidth
                                disabled={!canEdit()}
                                InputLabelProps={{ shrink: true }}
                                size="small"
                            />
                        </Grid>

                        {/* 3행 - 연락처 & 탈퇴일 */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="전화번호"
                                value={editForm.hp || ''}
                                onChange={(e) => handleInputChange('hp', e.target.value)}
                                fullWidth
                                disabled={!canEdit()}
                                placeholder="010-0000-0000"
                                size="small"
                                error={editForm.hp && validatePhoneNumber(editForm.hp) !== ''}
                                helperText={editForm.hp && validatePhoneNumber(editForm.hp) !== '' ? validatePhoneNumber(editForm.hp) : ''}
                                inputProps={{ maxLength: 13 }} // 010-1234-5678 = 13자
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                label="탈퇴일" 
                                value={formatDateTime(userDetail.withdrawal_date)} 
                                fullWidth 
                                disabled 
                                size="small" 
                            />
                        </Grid>
                        
                        {/* 4행 - 주소 */}
                        <Grid item xs={12} sm={canEdit() ? 10 : 12}>
                            <TextField
                                label="주소"
                                value={editForm.address || ''}
                                onChange={(e) => handleInputChange('address', e.target.value)}
                                fullWidth
                                disabled={!canEdit()}
                                size="small"
                                placeholder="주소 검색 후 상세주소까지 입력하세요"
                            />
                        </Grid>
                        {canEdit() && (
                            <Grid item xs={12} sm={2}>
                                <Button
                                    variant="outlined"
                                    onClick={handleAddressSearch}
                                    fullWidth
                                    size="small"
                                    sx={{ height: '40px' }}
                                >
                                    주소 검색
                                </Button>
                            </Grid>
                        )}

                        {/* 5행 - 취미 & 특이사항 */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="취미/특기"
                                value={editForm.hobby || ''}
                                onChange={(e) => handleInputChange('hobby', e.target.value)}
                                fullWidth
                                disabled={!canEdit()}
                                multiline
                                rows={3}
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="특이사항"
                                value={editForm.note || ''}
                                onChange={(e) => handleInputChange('note', e.target.value)}
                                fullWidth
                                disabled={!canEdit()}
                                multiline
                                rows={3}
                                size="small"
                                placeholder="특이사항을 입력하세요"
                            />
                        </Grid>

                        {/* 6행 - 관리 기능들을 한 줄로 배치 */}
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

                                {/* 계정 상태 관리 - 완전 클릭 방지 */}
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
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                        }}
                                        sx={{ 
                                            cursor: 'default',
                                            pointerEvents: 'none',  // 완전히 클릭 차단
                                            '&:hover': {
                                                backgroundColor: userDetail.status_yn === 'Y' ? '#d32f2f' : '#2e7d32',
                                            }
                                        }}
                                    />
                                    {canEdit() && (
                                        <>
                                            {userDetail.status_yn === 'Y' ? (
                                                <Button 
                                                    variant="contained" 
                                                    color="success" 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        e.preventDefault();
                                                        restoreUser();
                                                    }} 
                                                    size="small"
                                                >
                                                    복구
                                                </Button>
                                            ) : (
                                                <Button 
                                                    variant="outlined" 
                                                    color="error" 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        e.preventDefault();
                                                        withdrawUser();
                                                    }} 
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
                {/* 저장 버튼 (수정 권한이 있을 때만) */}
                {canEdit() && (
                    <Button 
                        onClick={saveAllChanges} 
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