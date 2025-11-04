import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import PopupModal from "../components/PopupModal";
import {
  useChecklists,
  type ChecklistItem,
} from "../contexts/ChecklistContext";
import { useTheme } from "../contexts/ThemeContext";

export default function EditChecklist() {
  const {
    id,
    title: initialTitle,
    items: initialItems,
  } = useLocalSearchParams();
  const router = useRouter();
  const { addChecklist, updateChecklist, deleteChecklist } = useChecklists();
  const { colors, themeName } = useTheme();

  // Create dynamic styles based on theme
  const styles = useMemo(() => createStyles(colors), [colors]);

  // Parse items from params if they exist
  const parsedItems: ChecklistItem[] = initialItems
    ? JSON.parse(initialItems as string)
    : [];

  const [title, setTitle] = useState((initialTitle as string) || "");
  const [items, setItems] = useState<ChecklistItem[]>(parsedItems);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingItemChallenge, setEditingItemChallenge] = useState("");
  const [editingItemResponse, setEditingItemResponse] = useState("");
  const [newItemChallenge, setNewItemChallenge] = useState("");
  const [newItemResponse, setNewItemResponse] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const isEditMode = !!id;

  const handleSave = () => {
    if (!title.trim()) {
      setModalMessage("Please enter a checklist name before saving.");
      setShowModal(true);
      return;
    }
    if (!isEditMode && items.length === 0) {
      setModalMessage(
        "Please add at least one item before saving your checklist.",
      );
      setShowModal(true);
      return;
    }

    // Add checked property to items
    const itemsWithChecked = items.map((item) => ({
      ...item,
      checked: false,
    }));

    if (isEditMode) {
      updateChecklist(id as string, title, itemsWithChecked);
    } else {
      addChecklist(title, itemsWithChecked);
    }
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  const handleDelete = () => {
    if (isEditMode && id) {
      deleteChecklist(id as string);
      router.back();
    }
  };

  const handleAddItem = () => {
    if (newItemChallenge.trim() && newItemResponse.trim()) {
      const newItem: ChecklistItem = {
        id: `${Date.now()}`,
        challenge: newItemChallenge.trim(),
        response: newItemResponse.trim(),
        checked: false,
      };
      setItems([...items, newItem]);
      setNewItemChallenge("");
      setNewItemResponse("");
    }
  };

  const handleDeleteItem = (itemId: string) => {
    setItems(items.filter((item) => item.id !== itemId));
  };

  const handleEditItem = (itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    if (item) {
      setEditingItemId(itemId);
      setEditingItemChallenge(item.challenge);
      setEditingItemResponse(item.response);
    }
  };

  const handleSaveItemEdit = (itemId: string) => {
    setItems(
      items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              challenge: editingItemChallenge.trim(),
              response: editingItemResponse.trim(),
            }
          : item,
      ),
    );
    setEditingItemId(null);
    setEditingItemChallenge("");
    setEditingItemResponse("");
  };

  const handleCancelItemEdit = () => {
    setEditingItemId(null);
    setEditingItemChallenge("");
    setEditingItemResponse("");
  };

  const handleMoveItemUp = (itemId: string) => {
    const index = items.findIndex((item) => item.id === itemId);
    if (index > 0) {
      const newItems = [...items];
      [newItems[index - 1], newItems[index]] = [
        newItems[index],
        newItems[index - 1],
      ];
      setItems(newItems);
    }
  };

  const handleMoveItemDown = (itemId: string) => {
    const index = items.findIndex((item) => item.id === itemId);
    if (index < items.length - 1) {
      const newItems = [...items];
      [newItems[index], newItems[index + 1]] = [
        newItems[index + 1],
        newItems[index],
      ];
      setItems(newItems);
    }
  };

  const renderItem = ({ item }: { item: ChecklistItem }) => {
    const isEditing = editingItemId === item.id;

    if (isEditing) {
      return (
        <View style={styles.editItemContainer}>
          <TextInput
            style={styles.itemInput}
            value={editingItemChallenge}
            onChangeText={setEditingItemChallenge}
            placeholder="Challenge"
            autoFocus
          />
          <TextInput
            style={styles.itemInput}
            value={editingItemResponse}
            onChangeText={setEditingItemResponse}
            placeholder="Response"
          />
          <View style={styles.itemButtonsRow}>
            <TouchableOpacity
              style={[styles.itemButton, styles.saveButton]}
              onPress={() => handleSaveItemEdit(item.id)}
              activeOpacity={0.7}
            >
              <Text selectable={false} style={styles.itemButtonText}>
                Save
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.itemButton, styles.cancelButton]}
              onPress={handleCancelItemEdit}
              activeOpacity={0.7}
            >
              <Text selectable={false} style={styles.itemButtonText}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    const itemIndex = items.findIndex((i) => i.id === item.id);
    const isFirst = itemIndex === 0;
    const isLast = itemIndex === items.length - 1;

    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemContent}>
          <Text selectable={false} style={styles.itemText}>
            {item.challenge}
          </Text>
          <View style={styles.dottedLine} />
          <Text selectable={false} style={styles.statusText}>
            {item.response}
          </Text>
        </View>
        <View style={styles.itemButtonsRow}>
          <TouchableOpacity
            style={[styles.moveButton, isFirst && styles.moveButtonDisabled]}
            onPress={() => handleMoveItemUp(item.id)}
            activeOpacity={0.7}
            disabled={isFirst}
          >
            <Text
              selectable={false}
              style={[
                styles.moveButtonText,
                isFirst && styles.moveButtonTextDisabled,
              ]}
            >
              ▲
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.moveButton, isLast && styles.moveButtonDisabled]}
            onPress={() => handleMoveItemDown(item.id)}
            activeOpacity={0.7}
            disabled={isLast}
          >
            <Text
              selectable={false}
              style={[
                styles.moveButtonText,
                isLast && styles.moveButtonTextDisabled,
              ]}
            >
              ▼
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.itemButton, styles.editButton]}
            onPress={() => handleEditItem(item.id)}
            activeOpacity={0.7}
          >
            <Text selectable={false} style={styles.itemButtonText}>
              Edit
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.itemButton, styles.deleteButton]}
            onPress={() => handleDeleteItem(item.id)}
            activeOpacity={0.7}
          >
            <Text selectable={false} style={styles.itemButtonText}>
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar
        barStyle={themeName === "dark" ? "light-content" : "dark-content"}
      />

      <PopupModal
        visible={showModal}
        message={modalMessage}
        onClose={() => setShowModal(false)}
        colors={colors}
      />

      <View style={styles.header}>
        <Text selectable={false} style={styles.headerTitle}>
          {isEditMode ? "Edit Checklist" : "New Checklist"}
        </Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text selectable={false} style={styles.label}>
            Checklist Name
          </Text>
          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter checklist name"
            placeholderTextColor={colors.placeholder}
          />
        </View>

        <View style={styles.section}>
          <Text selectable={false} style={styles.label}>
            Items
          </Text>

          <View style={styles.addItemSection}>
            <TextInput
              style={styles.addItemInput}
              value={newItemChallenge}
              onChangeText={setNewItemChallenge}
              placeholder="Challenge"
              placeholderTextColor={colors.placeholder}
            />
            <TextInput
              style={styles.addItemInput}
              value={newItemResponse}
              onChangeText={setNewItemResponse}
              placeholder="Response"
              placeholderTextColor={colors.placeholder}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddItem}
              activeOpacity={0.7}
            >
              <Text selectable={false} style={styles.addButtonText}>
                Add Item
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.itemsList}>
            {items.map((item) => (
              <View key={item.id}>{renderItem({ item })}</View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.footerButton, styles.cancelFooterButton]}
          onPress={handleCancel}
          activeOpacity={0.7}
        >
          <Text selectable={false} style={styles.footerButtonText}>
            Cancel
          </Text>
        </TouchableOpacity>
        {isEditMode && (
          <TouchableOpacity
            style={[styles.footerButton, styles.deleteFooterButton]}
            onPress={handleDelete}
            activeOpacity={0.7}
          >
            <Text selectable={false} style={styles.footerButtonText}>
              Delete
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.footerButton, styles.saveFooterButton]}
          onPress={handleSave}
          activeOpacity={0.7}
        >
          <Text selectable={false} style={styles.footerButtonText}>
            Save
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingTop: 60,
      paddingHorizontal: 16,
      paddingBottom: 16,
      backgroundColor: colors.background,
      justifyContent: "center",
      alignItems: "center",
      borderBottomWidth: 2,
      borderBottomColor: colors.borderStrong,
    },
    headerTitle: {
      fontSize: 32,
      fontWeight: "bold",
      color: colors.textPrimary,
      letterSpacing: 0.5,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    section: {
      marginBottom: 24,
    },
    label: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.textPrimary,
      marginBottom: 12,
      letterSpacing: 0.5,
    },
    titleInput: {
      fontFamily: "SpaceMono-Regular",
      backgroundColor: colors.surface,
      borderWidth: 2,
      borderColor: colors.borderStrong,
      padding: 16,
      fontSize: 16,
      color: colors.textPrimary,
      letterSpacing: 0.3,
    },
    addItemSection: {
      backgroundColor: colors.surface,
      padding: 12,
      borderWidth: 2,
      borderColor: colors.borderStrong,
      marginBottom: 16,
    },
    addItemInput: {
      fontFamily: "SpaceMono-Regular",
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.borderStrong,
      padding: 12,
      fontSize: 14,
      marginBottom: 8,
      color: colors.textPrimary,
    },
    addButton: {
      backgroundColor: colors.surface,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: colors.borderStrong,
      alignItems: "center",
    },
    addButtonText: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.textPrimary,
      letterSpacing: 0.5,
    },
    itemsList: {
      gap: 8,
    },
    itemContainer: {
      backgroundColor: colors.surface,
      borderWidth: 2,
      borderColor: colors.borderStrong,
      padding: 12,
    },
    itemContent: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    moveButton: {
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: colors.borderStrong,
      backgroundColor: colors.background,
      minWidth: 32,
    },
    moveButtonDisabled: {
      backgroundColor: colors.disabled,
      borderColor: colors.placeholder,
    },
    moveButtonText: {
      fontSize: 12,
      color: colors.textPrimary,
      fontWeight: "bold",
      textAlign: "center",
    },
    moveButtonTextDisabled: {
      color: colors.placeholder,
    },
    itemText: {
      fontSize: 16,
      color: colors.textPrimary,
      letterSpacing: 0.3,
      flexShrink: 0,
      paddingRight: 4,
      fontWeight: "bold",
    },
    dottedLine: {
      flex: 1,
      height: 2,
      marginHorizontal: 4,
      borderBottomWidth: 2,
      borderBottomColor: colors.textPrimary,
      borderStyle: "dotted",
      marginBottom: 2,
      marginTop: 8,
    },
    statusText: {
      fontSize: 16,
      color: colors.textPrimary,
      letterSpacing: 0.5,
      textAlign: "right",
      paddingLeft: 4,
      flexShrink: 0,
    },
    itemButtonsRow: {
      flexDirection: "row",
      justifyContent: "flex-end",
      gap: 8,
    },
    itemButton: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: colors.borderStrong,
    },
    editButton: {
      backgroundColor: colors.surface,
    },
    deleteButton: {
      backgroundColor: colors.surface,
    },
    saveButton: {
      backgroundColor: colors.surface,
    },
    cancelButton: {
      backgroundColor: colors.surface,
    },
    itemButtonText: {
      fontSize: 12,
      fontWeight: "bold",
      color: colors.textPrimary,
    },
    editItemContainer: {
      backgroundColor: colors.surface,
      padding: 12,
      borderWidth: 2,
      borderColor: colors.borderStrong,
    },
    itemInput: {
      fontFamily: "SpaceMono-Regular",
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.borderStrong,
      padding: 8,
      fontSize: 14,
      marginBottom: 8,
      color: colors.textPrimary,
    },
    footer: {
      flexDirection: "row",
      padding: 16,
      gap: 12,
      borderTopWidth: 2,
      borderTopColor: colors.borderStrong,
      backgroundColor: colors.background,
    },
    footerButton: {
      flex: 1,
      paddingVertical: 16,
      alignItems: "center",
      borderWidth: 2,
      borderColor: colors.borderStrong,
    },
    cancelFooterButton: {
      backgroundColor: colors.background,
    },
    deleteFooterButton: {
      backgroundColor: colors.surface,
    },
    saveFooterButton: {
      backgroundColor: colors.background,
    },
    footerButtonText: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.textPrimary,
      letterSpacing: 0.5,
    },
  });
