import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function SenderSelectionGrid({
  senders,
  onSelectionChange,
  onClose,
  onConfirm,
  selectedSenders = [],
}) {
  const [senderStates, setSenderStates] = useState(() => {
    const initialState = {};
    selectedSenders.forEach(({ id, limit }) => {
      initialState[id] = { selected: true, limit };
    });
    return initialState;
  });

  useEffect(() => {
    const newState = {};
    selectedSenders.forEach(({ id, limit }) => {
      newState[id] = { selected: true, limit };
    });
    setSenderStates(newState);
  }, [selectedSenders]);

  const handleSelect = (senderId, isChecked) => {
    setSenderStates((prev) => {
      const currentState = prev[senderId] || {
        selected: false,
        limit: senders.find((s) => s.id === senderId)?.limit || 1,
      };
      return {
        ...prev,
        [senderId]: {
          ...currentState,
          selected: isChecked,
        },
      };
    });
  };

  const handleSelectAll = (isChecked) => {
    const newStates = {};
    if (isChecked) {
      senders.forEach((sender) => {
        newStates[sender.id] = {
          selected: true,
          limit: senderStates[sender.id]?.limit || sender.limit,
        };
      });
    }
    setSenderStates(isChecked ? newStates : {});
  };

  const handleLimitChange = (senderId, value) => {
    setSenderStates((prev) => ({
      ...prev,
      [senderId]: {
        ...(prev[senderId] || { selected: true }),
        limit: Number(value),
      },
    }));
  };

  const handleSubmit = () => {
    const selectionWithLimits = Object.entries(senderStates)
      .filter(([_, state]) => state.selected)
      .map(([id, state]) => ({
        id,
        limit: state.limit,
      }));
    onSelectionChange(selectionWithLimits);
    onConfirm();
  };

  const selectedCount = Object.values(senderStates).filter(
    (s) => s.selected,
  ).length;
  const allSelected = selectedCount === senders.length && senders.length > 0;
  const someSelected = selectedCount > 0 && selectedCount < senders.length;

  return (
    <div className="bg-[#f9f9fb] rounded-2xl p-6 shadow-lg">
      <Table className="rounded-xl border border-gray-200">
        <TableHeader className="bg-[#f1effa] text-gray-700">
          <TableRow>
            <TableHead className="w-10">
              <Checkbox
                checked={allSelected}
                onCheckedChange={handleSelectAll}
                indeterminate={someSelected ? true : undefined}
              />
            </TableHead>
            <TableHead>Email Name</TableHead>
            <TableHead>Designation</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Daily Limit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {senders.map((sender) => {
            const isSelected = senderStates[sender.id]?.selected || false;
            const limit = senderStates[sender.id]?.limit || sender.limit;

            return (
              <TableRow
                key={sender.id}
                className={`${
                  isSelected ? "bg-[#ece9f5]" : "hover:bg-[#f3f3f7]"
                } transition-colors`}
              >
                <TableCell>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) =>
                      handleSelect(sender.id, checked)
                    }
                  />
                </TableCell>
                <TableCell>{sender.email_name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {sender.designation}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {sender.email_user}
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="1"
                    className="w-24 h-8 rounded-md border border-gray-300"
                    value={limit}
                    onChange={(e) =>
                      handleLimitChange(sender.id, e.target.value)
                    }
                    disabled={!isSelected}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <div className="flex justify-end gap-3 pt-6">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          className="bg-[#d8b4fe] text-[#301934] hover:bg-[#c084fc] transition-colors"
          onClick={handleSubmit}
        >
          Confirm Selection
        </Button>
      </div>
    </div>
  );
}
