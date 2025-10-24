import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export interface ChecklistItem {
  id: string;
  challenge: string;
  response: string;
  checked: boolean;
}

export interface Checklist {
  id: string;
  title: string;
  items: ChecklistItem[];
  expanded: boolean;
}

interface ChecklistContextType {
  checklists: Checklist[];
  isLoading: boolean;
  addChecklist: (title: string, items: ChecklistItem[]) => void;
  updateChecklist: (id: string, title: string, items: ChecklistItem[]) => void;
  deleteChecklist: (id: string) => void;
  toggleExpanded: (id: string) => void;
  toggleItem: (checklistId: string, itemId: string) => void;
  updateItem: (
    checklistId: string,
    itemId: string,
    challenge: string,
    response: string,
  ) => void;
  uncheckAllChecklists: () => void;
}

const ChecklistContext = createContext<ChecklistContextType | undefined>(
  undefined,
);

const STORAGE_KEY = "@checklists_data";

export function ChecklistProvider({ children }: { children: ReactNode }) {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load checklists from AsyncStorage on mount
  useEffect(() => {
    loadChecklists();
  }, []);

  // Save checklists to AsyncStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      saveChecklists();
    }
  }, [checklists, isLoading]);

  const loadChecklists = async () => {
    try {
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedData !== null) {
        setChecklists(JSON.parse(storedData));
      }
    } catch (error) {
      console.error("Error loading checklists:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveChecklists = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(checklists));
    } catch (error) {
      console.error("Error saving checklists:", error);
    }
  };

  const addChecklist = (title: string, items: ChecklistItem[]) => {
    const newId = Date.now().toString();
    const newChecklist: Checklist = {
      id: newId,
      title,
      items: items.map((item) => ({ ...item, checked: false })),
      expanded: false,
    };
    setChecklists([...checklists, newChecklist]);
  };

  const updateChecklist = (
    id: string,
    title: string,
    items: ChecklistItem[],
  ) => {
    setChecklists(
      checklists.map((checklist) =>
        checklist.id === id
          ? {
              ...checklist,
              title,
              items: items.map((item) => {
                // Preserve checked status for existing items
                const existingItem = checklist.items.find(
                  (ei) => ei.id === item.id,
                );
                return {
                  ...item,
                  checked: existingItem?.checked || false,
                };
              }),
            }
          : checklist,
      ),
    );
  };

  const deleteChecklist = (id: string) => {
    setChecklists(checklists.filter((checklist) => checklist.id !== id));
  };

  const toggleExpanded = (id: string) => {
    setChecklists(
      checklists.map((checklist) =>
        checklist.id === id
          ? { ...checklist, expanded: !checklist.expanded }
          : checklist,
      ),
    );
  };

  const toggleItem = (checklistId: string, itemId: string) => {
    setChecklists(
      checklists.map((checklist) => {
        if (checklist.id === checklistId) {
          return {
            ...checklist,
            items: checklist.items.map((item) =>
              item.id === itemId ? { ...item, checked: !item.checked } : item,
            ),
          };
        }
        return checklist;
      }),
    );
  };

  const updateItem = (
    checklistId: string,
    itemId: string,
    challenge: string,
    response: string,
  ) => {
    setChecklists(
      checklists.map((checklist) => {
        if (checklist.id === checklistId) {
          return {
            ...checklist,
            items: checklist.items.map((item) =>
              item.id === itemId ? { ...item, challenge, response } : item,
            ),
          };
        }
        return checklist;
      }),
    );
  };

  const uncheckAllChecklists = () => {
    setChecklists(
      checklists.map((checklist) => ({
        ...checklist,
        items: checklist.items.map((item) => ({
          ...item,
          checked: false,
        })),
      })),
    );
  };

  return (
    <ChecklistContext.Provider
      value={{
        checklists,
        isLoading,
        addChecklist,
        updateChecklist,
        deleteChecklist,
        toggleExpanded,
        toggleItem,
        updateItem,
        uncheckAllChecklists,
      }}
    >
      {children}
    </ChecklistContext.Provider>
  );
}

export function useChecklists() {
  const context = useContext(ChecklistContext);
  if (context === undefined) {
    throw new Error("useChecklists must be used within a ChecklistProvider");
  }
  return context;
}
