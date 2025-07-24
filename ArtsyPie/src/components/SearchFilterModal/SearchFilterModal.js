import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView, Switch } from 'react-native';
import Slider from '@react-native-community/slider';

export default function SearchFilterModal({ visible, onClose, onApply, filters = {} }) {
  const [selectedTypes, setSelectedTypes] = useState(filters.types || []);
  const [selectedStyles, setSelectedStyles] = useState(filters.styles || []);
  const [selectedSizes, setSelectedSizes] = useState(filters.sizes || []);
  const [selectedOrientations, setSelectedOrientations] = useState(filters.orientations || []);
  const [priceRange, setPriceRange] = useState(filters.priceRange || [0, 20000000]);
  const [sortOption, setSortOption] = useState(filters.sort || 'Mới nhất');

  const paintingTypes = ['Sơn dầu', 'Sơn mài', 'Acrylic', 'Màu nước'];
  const paintingStyles = ['Trừu tượng', 'Hiện thực', 'Lập thể', 'Ấn tượng', 'Tối giản'];
  const paintingSizes = ['Nhỏ', 'Vừa', 'Lớn'];
  const paintingOrientations = ['Ngang', 'Dọc', 'Vuông'];
  const sortOptions = ['Mới nhất', 'Giá thấp đến cao', 'Giá cao đến thấp'];

  const toggleSelection = (item, array, setArray) => {
    if (array.includes(item)) {
      setArray(array.filter(i => i !== item));
    } else {
      setArray([...array, item]);
    }
  };

  const handleApply = () => {
    onApply({
      types: selectedTypes,
      styles: selectedStyles,
      sizes: selectedSizes,
      orientations: selectedOrientations,
      priceRange: priceRange,
      sort: sortOption
    });
    onClose();
  };

  const handleReset = () => {
    setSelectedTypes([]);
    setSelectedStyles([]);
    setSelectedSizes([]);
    setSelectedOrientations([]);
    setPriceRange([0, 20000000]);
    setSortOption('Mới nhất');
  };

  const formatPrice = (value) => {
    return `${(value / 1000000).toFixed(0)}M VNĐ`;
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Bộ lọc tìm kiếm</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Loại hình */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Loại hình</Text>
              <View style={styles.optionsContainer}>
                {paintingTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.option,
                      selectedTypes.includes(type) && styles.selectedOption,
                    ]}
                    onPress={() => toggleSelection(type, selectedTypes, setSelectedTypes)}
                  >
                    <Text style={[
                      styles.optionText,
                      selectedTypes.includes(type) && styles.selectedOptionText
                    ]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Phong cách */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Phong cách</Text>
              <View style={styles.optionsContainer}>
                {paintingStyles.map((style) => (
                  <TouchableOpacity
                    key={style}
                    style={[
                      styles.option,
                      selectedStyles.includes(style) && styles.selectedOption,
                    ]}
                    onPress={() => toggleSelection(style, selectedStyles, setSelectedStyles)}
                  >
                    <Text style={[
                      styles.optionText,
                      selectedStyles.includes(style) && styles.selectedOptionText
                    ]}>
                      {style}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Kích thước */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Kích thước</Text>
              <View style={styles.optionsContainer}>
                {paintingSizes.map((size) => (
                  <TouchableOpacity
                    key={size}
                    style={[
                      styles.option,
                      selectedSizes.includes(size) && styles.selectedOption,
                    ]}
                    onPress={() => toggleSelection(size, selectedSizes, setSelectedSizes)}
                  >
                    <Text style={[
                      styles.optionText,
                      selectedSizes.includes(size) && styles.selectedOptionText
                    ]}>
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Hướng tranh */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Hướng tranh</Text>
              <View style={styles.optionsContainer}>
                {paintingOrientations.map((orientation) => (
                  <TouchableOpacity
                    key={orientation}
                    style={[
                      styles.option,
                      selectedOrientations.includes(orientation) && styles.selectedOption,
                    ]}
                    onPress={() => toggleSelection(orientation, selectedOrientations, setSelectedOrientations)}
                  >
                    <Text style={[
                      styles.optionText,
                      selectedOrientations.includes(orientation) && styles.selectedOptionText
                    ]}>
                      {orientation}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Khoảng giá */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Khoảng giá</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.priceText}>
                  {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                </Text>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={20000000}
                  value={priceRange[1]}
                  onValueChange={(value) => setPriceRange([priceRange[0], value])}
                  minimumTrackTintColor="#FF6B6B"
                  maximumTrackTintColor="#E0E0E0"
                  thumbStyle={styles.sliderThumb}
                />
              </View>
            </View>

            {/* Sắp xếp */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sắp xếp</Text>
              <View style={styles.optionsContainer}>
                {sortOptions.map((sort) => (
                  <TouchableOpacity
                    key={sort}
                    style={[
                      styles.option,
                      sortOption === sort && styles.selectedOption,
                    ]}
                    onPress={() => setSortOption(sort)}
                  >
                    <Text style={[
                      styles.optionText,
                      sortOption === sort && styles.selectedOptionText
                    ]}>
                      {sort}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetButtonText}>Đặt lại</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>Áp dụng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#00000080',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    fontSize: 24,
    color: '#666',
    padding: 5,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#F8F8F8',
  },
  selectedOption: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  optionText: {
    fontSize: 14,
    color: '#666',
  },
  selectedOptionText: {
    color: '#fff',
    fontWeight: '600',
  },
  priceContainer: {
    paddingHorizontal: 10,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderThumb: {
    backgroundColor: '#FF6B6B',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 12,
    backgroundColor: '#FF6B6B',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
