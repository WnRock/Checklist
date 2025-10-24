import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ThemeColors } from "../constants/Color";

interface PopupModalProps {
  visible: boolean;
  message: string;
  onClose: () => void;
  colors: ThemeColors;
}

const PopupModal: React.FC<PopupModalProps> = ({
  visible,
  message,
  onClose,
  colors,
}) => {
  const styles = createStyles(colors);
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text selectable={false} style={styles.message}>
            {message}
          </Text>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text selectable={false} style={styles.buttonText}>
              OK
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 32,
    },
    container: {
      backgroundColor: colors.surface,
      padding: 24,
      borderWidth: 2,
      borderColor: colors.borderStrong,
      maxWidth: 400,
    },
    message: {
      fontSize: 16,
      marginBottom: 20,
      textAlign: "center",
      color: colors.textPrimary,
      letterSpacing: 0.3,
    },
    button: {
      backgroundColor: colors.surface,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderWidth: 2,
      borderColor: colors.borderStrong,
      alignSelf: "center",
    },
    buttonText: {
      color: colors.textPrimary,
      fontWeight: "bold",
      fontSize: 16,
      letterSpacing: 0.5,
    },
  });

export default PopupModal;
