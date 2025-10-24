import { useRouter } from "expo-router";
import { useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useChecklists, type Checklist } from "../contexts/ChecklistContext";
import { useTheme } from "../contexts/ThemeContext";

export default function Index() {
  const router = useRouter();
  const {
    checklists,
    isLoading,
    toggleExpanded,
    toggleItem,
    uncheckAllChecklists,
  } = useChecklists();
  const { colors, themeName } = useTheme();

  // Create dynamic styles based on theme
  const styles = useMemo(() => createStyles(colors), [colors]);

  const handleChecklistPress = (id: string) => {
    toggleExpanded(id);
  };

  const handleChecklistLongPress = (id: string) => {
    const checklist = checklists.find((c) => c.id === id);
    if (checklist) {
      router.push({
        pathname: "/edit-checklist",
        params: {
          id: checklist.id,
          title: checklist.title,
          items: JSON.stringify(
            checklist.items.map((item) => ({
              id: item.id,
              challenge: item.challenge,
              response: item.response,
            })),
          ),
        },
      });
    }
  };

  const handleToggleItem = (checklistId: string, itemId: string) => {
    toggleItem(checklistId, itemId);
  };

  const handleAddChecklist = () => {
    router.push("/edit-checklist");
  };

  const handleResetAll = () => {
    uncheckAllChecklists();
  };

  const renderChecklistItem = ({ item }: { item: Checklist }) => {
    const allChecked =
      item.items.length > 0 && item.items.every((i) => i.checked);

    return (
      <View style={styles.checklistWrapper}>
        <Pressable
          style={[
            styles.checklistCard,
            allChecked && styles.checklistCardCompleted,
          ]}
          onPress={() => handleChecklistPress(item.id)}
          onLongPress={() => handleChecklistLongPress(item.id)}
          delayLongPress={500}
        >
          <View style={styles.cardContent}>
            <Text selectable={false} style={styles.checklistTitle}>
              {item.title}
            </Text>
          </View>
        </Pressable>

        {item.expanded && (
          <View style={styles.itemsContainer}>
            {item.items.map((checklistItem) => (
              <Pressable
                key={checklistItem.id}
                style={styles.checklistItem}
                onPress={() => handleToggleItem(item.id, checklistItem.id)}
              >
                <Text
                  selectable={false}
                  style={[
                    styles.itemText,
                    checklistItem.checked && styles.itemTextChecked,
                  ]}
                >
                  {checklistItem.challenge}
                </Text>
                <View style={styles.dottedLine} />
                <Text
                  selectable={false}
                  style={[
                    styles.statusText,
                    checklistItem.checked && styles.statusTextChecked,
                  ]}
                >
                  {checklistItem.response}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={themeName === "dark" ? "light-content" : "dark-content"}
      />

      <View style={styles.header}>
        <Text selectable={false} style={styles.headerTitle}>
          Checklists
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.textPrimary} />
        </View>
      ) : checklists.length === 0 ? (
        <View style={styles.emptyState}>
          <Text selectable={false} style={styles.emptyStateTitle}>
            No Checklists Yet
          </Text>
          <Text selectable={false} style={styles.emptyStateDescription}>
            Tap the button below to create your first checklist
          </Text>
        </View>
      ) : (
        <FlatList
          data={checklists}
          renderItem={renderChecklistItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}

      {checklists.length > 0 && (
        <TouchableOpacity
          style={styles.resetFab}
          onPress={handleResetAll}
          activeOpacity={0.7}
        >
          <Text selectable={false} style={styles.resetFabText}>
            R
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={handleAddChecklist}
        activeOpacity={0.7}
      >
        <Text selectable={false} style={styles.fabText}>
          +
        </Text>
      </TouchableOpacity>
    </View>
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
    emptyState: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 32,
    },
    emptyStateTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.textPrimary,
      marginBottom: 12,
      textAlign: "center",
    },
    emptyStateDescription: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 24,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    listContent: {
      padding: 16,
      paddingBottom: 150,
    },
    checklistWrapper: {
      marginBottom: 8,
    },
    checklistCard: {
      backgroundColor: colors.surface,
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginBottom: 0,
      borderWidth: 2,
      borderColor: colors.borderStrong,
    },
    checklistCardCompleted: {
      backgroundColor: colors.completedItemBackground,
    },
    cardContent: {
      flexDirection: "column",
      justifyContent: "center",
    },
    checklistTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.textPrimary,
      letterSpacing: 0.5,
      textAlign: "center",
      lineHeight: 20,
    },
    itemsContainer: {
      backgroundColor: colors.background,
      borderWidth: 2,
      borderTopWidth: 0,
      borderColor: colors.borderStrong,
      paddingHorizontal: 8,
      paddingVertical: 8,
      marginBottom: 0,
    },
    checklistItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
      paddingHorizontal: 8,
    },
    itemText: {
      fontSize: 16,
      color: colors.textPrimary,
      letterSpacing: 0.3,
      flexShrink: 0,
      paddingRight: 4,
      // fontWeight: "bold",
    },
    itemTextChecked: {
      color: colors.textSecondary,
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
    statusTextChecked: {
      color: colors.completedItem,
    },
    fab: {
      position: "absolute",
      right: 20,
      bottom: 20,
      width: 50,
      height: 50,
      backgroundColor: colors.surface,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: colors.fabBorder,
    },
    fabText: {
      color: colors.textPrimary,
      fontSize: 28,
      fontWeight: "bold",
      textAlign: "center",
    },
    resetFab: {
      position: "absolute",
      right: 20,
      bottom: 80,
      width: 50,
      height: 50,
      backgroundColor: colors.surface,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: colors.fabBorder,
    },
    resetFabText: {
      color: colors.textPrimary,
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
    },
  });
