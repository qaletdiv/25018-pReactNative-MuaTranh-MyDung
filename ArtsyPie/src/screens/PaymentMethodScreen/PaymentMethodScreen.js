import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import styles from './PaymentMethodScreen.styles';
import { COLORS } from '../../theme/colors';

export default function PaymentMethodScreen() {
  const navigation = useNavigation();
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: '1',
      type: 'card',
      name: 'Visa ending in 1234',
      number: '**** **** **** 1234',
      expiry: '12/25',
      isDefault: true,
      cardType: 'visa',
    },
    {
      id: '2',
      type: 'card',
      name: 'Mastercard ending in 5678',
      number: '**** **** **** 5678',
      expiry: '08/26',
      isDefault: false,
      cardType: 'mastercard',
    },
    {
      id: '3',
      type: 'bank',
      name: 'Bank Transfer',
      account: '1234567890',
      bankName: 'Vietcombank',
      isDefault: false,
    },
  ]);

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState(null);
  const [newPaymentType, setNewPaymentType] = useState('card');

  const [formData, setFormData] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: '',
    bankName: '',
    accountNumber: '',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (newPaymentType === 'card') {
      if (!formData.cardNumber.trim()) {
        newErrors.cardNumber = 'Card number is required';
      } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Invalid card number';
      }

      if (!formData.cardholderName.trim()) {
        newErrors.cardholderName = 'Cardholder name is required';
      }

      if (!formData.expiryDate.trim()) {
        newErrors.expiryDate = 'Expiry date is required';
      } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = 'Invalid expiry date (MM/YY)';
      }

      if (!formData.cvv.trim()) {
        newErrors.cvv = 'CVV is required';
      } else if (!/^\d{3,4}$/.test(formData.cvv)) {
        newErrors.cvv = 'Invalid CVV';
      }
    } else {
      if (!formData.bankName.trim()) {
        newErrors.bankName = 'Bank name is required';
      }

      if (!formData.accountNumber.trim()) {
        newErrors.accountNumber = 'Account number is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddPaymentMethod = () => {
    if (!validateForm()) {
      return;
    }

    const newPayment = {
      id: Date.now().toString(),
      type: newPaymentType,
      isDefault: paymentMethods.length === 0,
    };

    if (newPaymentType === 'card') {
      newPayment.name = `${getCardType(formData.cardNumber)} ending in ${formData.cardNumber.slice(-4)}`;
      newPayment.number = `**** **** **** ${formData.cardNumber.slice(-4)}`;
      newPayment.expiry = formData.expiryDate;
      newPayment.cardType = getCardType(formData.cardNumber);
    } else {
      newPayment.name = 'Bank Transfer';
      newPayment.account = formData.accountNumber;
      newPayment.bankName = formData.bankName;
    }

    setPaymentMethods(prev => [...prev, newPayment]);
    setAddModalVisible(false);
    resetForm();
  };

  const getCardType = (cardNumber) => {
    const number = cardNumber.replace(/\s/g, '');
    if (/^4/.test(number)) return 'visa';
    if (/^5[1-5]/.test(number)) return 'mastercard';
    if (/^3[47]/.test(number)) return 'amex';
    return 'unknown';
  };

  const resetForm = () => {
    setFormData({
      cardNumber: '',
      cardholderName: '',
      expiryDate: '',
      cvv: '',
      bankName: '',
      accountNumber: '',
    });
    setErrors({});
    setNewPaymentType('card');
  };

  const handleSetDefault = (paymentId) => {
    setPaymentMethods(prev => 
      prev.map(payment => ({
        ...payment,
        isDefault: payment.id === paymentId
      }))
    );
  };

  const handleDeletePayment = (payment) => {
    if (payment.isDefault) {
      Alert.alert(
        'Cannot Delete',
        'You cannot delete your default payment method. Please set another method as default first.',
        [{ text: 'OK' }]
      );
      return;
    }

    setPaymentToDelete(payment);
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    if (paymentToDelete) {
      setPaymentMethods(prev => prev.filter(payment => payment.id !== paymentToDelete.id));
      setDeleteModalVisible(false);
      setPaymentToDelete(null);
    }
  };

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };

  const renderPaymentMethod = (payment) => (
    <View key={payment.id} style={styles.paymentCard}>
      <View style={styles.paymentHeader}>
        <View style={styles.paymentInfo}>
          <View style={styles.paymentNameRow}>
            <Text style={styles.paymentName}>{payment.name}</Text>
            {payment.isDefault && (
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultBadgeText}>Default</Text>
              </View>
            )}
          </View>
          
          {payment.type === 'card' ? (
            <>
              <Text style={styles.paymentNumber}>{payment.number}</Text>
              <Text style={styles.paymentExpiry}>Expires: {payment.expiry}</Text>
            </>
          ) : (
            <>
              <Text style={styles.paymentBank}>{payment.bankName}</Text>
              <Text style={styles.paymentAccount}>Account: {payment.account}</Text>
            </>
          )}
        </View>
        
        <View style={styles.paymentActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleSetDefault(payment.id)}
          >
            <Ionicons 
              name={payment.isDefault ? "checkmark-circle" : "checkmark-circle-outline"} 
              size={20} 
              color={payment.isDefault ? COLORS.primary : "#666"} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeletePayment(payment)}
          >
            <Ionicons name="trash-outline" size={20} color="#dc3545" />
          </TouchableOpacity>
        </View>
      </View>
      
      {!payment.isDefault && (
        <TouchableOpacity
          style={styles.setDefaultButton}
          onPress={() => handleSetDefault(payment.id)}
        >
          <Text style={styles.setDefaultButtonText}>Set as Default</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderAddModal = () => (
    <Modal
      visible={addModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setAddModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Payment Method</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setAddModalVisible(false);
                resetForm();
              }}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.paymentTypeSelector}>
            <TouchableOpacity
              style={[
                styles.typeOption,
                newPaymentType === 'card' && styles.typeOptionSelected
              ]}
              onPress={() => setNewPaymentType('card')}
            >
              <Ionicons 
                name="card" 
                size={20} 
                color={newPaymentType === 'card' ? '#fff' : '#666'} 
              />
              <Text style={[
                styles.typeOptionText,
                newPaymentType === 'card' && styles.typeOptionTextSelected
              ]}>
                Credit/Debit Card
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeOption,
                newPaymentType === 'bank' && styles.typeOptionSelected
              ]}
              onPress={() => setNewPaymentType('bank')}
            >
              <Ionicons 
                name="business" 
                size={20} 
                color={newPaymentType === 'bank' ? '#fff' : '#666'} 
              />
              <Text style={[
                styles.typeOptionText,
                newPaymentType === 'bank' && styles.typeOptionTextSelected
              ]}>
                Bank Transfer
              </Text>
            </TouchableOpacity>
          </View>

          {newPaymentType === 'card' ? (
            <View style={styles.cardForm}>
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Card Number</Text>
                <TextInput
                  style={[styles.textInput, errors.cardNumber && styles.textInputError]}
                  value={formData.cardNumber}
                  onChangeText={(text) => {
                    const formatted = formatCardNumber(text);
                    setFormData(prev => ({ ...prev, cardNumber: formatted }));
                    if (errors.cardNumber) {
                      setErrors(prev => ({ ...prev, cardNumber: '' }));
                    }
                  }}
                  placeholder="1234 5678 9012 3456"
                  keyboardType="numeric"
                  maxLength={19}
                />
                {errors.cardNumber && <Text style={styles.errorText}>{errors.cardNumber}</Text>}
              </View>

              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Cardholder Name</Text>
                <TextInput
                  style={[styles.textInput, errors.cardholderName && styles.textInputError]}
                  value={formData.cardholderName}
                  onChangeText={(text) => {
                    setFormData(prev => ({ ...prev, cardholderName: text }));
                    if (errors.cardholderName) {
                      setErrors(prev => ({ ...prev, cardholderName: '' }));
                    }
                  }}
                  placeholder="John Doe"
                  autoCapitalize="words"
                />
                {errors.cardholderName && <Text style={styles.errorText}>{errors.cardholderName}</Text>}
              </View>

              <View style={styles.row}>
                <View style={[styles.formField, styles.halfField]}>
                  <Text style={styles.fieldLabel}>Expiry Date</Text>
                  <TextInput
                    style={[styles.textInput, errors.expiryDate && styles.textInputError]}
                    value={formData.expiryDate}
                    onChangeText={(text) => {
                      setFormData(prev => ({ ...prev, expiryDate: text }));
                      if (errors.expiryDate) {
                        setErrors(prev => ({ ...prev, expiryDate: '' }));
                      }
                    }}
                    placeholder="MM/YY"
                    keyboardType="numeric"
                    maxLength={5}
                  />
                  {errors.expiryDate && <Text style={styles.errorText}>{errors.expiryDate}</Text>}
                </View>

                <View style={[styles.formField, styles.halfField]}>
                  <Text style={styles.fieldLabel}>CVV</Text>
                  <TextInput
                    style={[styles.textInput, errors.cvv && styles.textInputError]}
                    value={formData.cvv}
                    onChangeText={(text) => {
                      setFormData(prev => ({ ...prev, cvv: text }));
                      if (errors.cvv) {
                        setErrors(prev => ({ ...prev, cvv: '' }));
                      }
                    }}
                    placeholder="123"
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry
                  />
                  {errors.cvv && <Text style={styles.errorText}>{errors.cvv}</Text>}
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.bankForm}>
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Bank Name</Text>
                <TextInput
                  style={[styles.textInput, errors.bankName && styles.textInputError]}
                  value={formData.bankName}
                  onChangeText={(text) => {
                    setFormData(prev => ({ ...prev, bankName: text }));
                    if (errors.bankName) {
                      setErrors(prev => ({ ...prev, bankName: '' }));
                    }
                  }}
                  placeholder="Vietcombank"
                />
                {errors.bankName && <Text style={styles.errorText}>{errors.bankName}</Text>}
              </View>

              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Account Number</Text>
                <TextInput
                  style={[styles.textInput, errors.accountNumber && styles.textInputError]}
                  value={formData.accountNumber}
                  onChangeText={(text) => {
                    setFormData(prev => ({ ...prev, accountNumber: text }));
                    if (errors.accountNumber) {
                      setErrors(prev => ({ ...prev, accountNumber: '' }));
                    }
                  }}
                  placeholder="1234567890"
                  keyboardType="numeric"
                />
                {errors.accountNumber && <Text style={styles.errorText}>{errors.accountNumber}</Text>}
              </View>
            </View>
          )}

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddPaymentMethod}
          >
            <Text style={styles.addButtonText}>Add Payment Method</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderDeleteModal = () => (
    <Modal
      visible={deleteModalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setDeleteModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Ionicons name="warning" size={24} color="#dc3545" />
            <Text style={styles.modalTitle}>Delete Payment Method</Text>
          </View>
          
          <Text style={styles.modalMessage}>
            Are you sure you want to delete this payment method? This action cannot be undone.
          </Text>
          
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setDeleteModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.modalButton, styles.deleteButton]}
              onPress={confirmDelete}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {paymentMethods.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="card-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>No Payment Methods</Text>
            <Text style={styles.emptyMessage}>
              You haven't added any payment methods yet. Add your first payment method to get started.
            </Text>
          </View>
        ) : (
          <View style={styles.paymentMethodsList}>
            {paymentMethods.map(renderPaymentMethod)}
          </View>
        )}
      </ScrollView>

      {/* Add Payment Method Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.addPaymentButton}
          onPress={() => setAddModalVisible(true)}
        >
          <Ionicons name="add" size={24} color="#fff" />
          <Text style={styles.addPaymentButtonText}>Add Payment Method</Text>
        </TouchableOpacity>
      </View>

      {renderAddModal()}
      {renderDeleteModal()}
    </SafeAreaView>
  );
} 