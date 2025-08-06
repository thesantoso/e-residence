"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Resident } from "@prisma/client";

export interface ResidentWithProfile extends Resident {
  profile?: {
    id: string;
    fullName: string | null;
    email: string | null;
  };
}

// Fetch all residents
export function useResidents() {
  return useQuery({
    queryKey: ["residents"],
    queryFn: async (): Promise<ResidentWithProfile[]> => {
      const response = await fetch("/api/residents");
      if (!response.ok) {
        throw new Error("Failed to fetch residents");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Fetch single resident
export function useResident(id: string) {
  return useQuery({
    queryKey: ["residents", id],
    queryFn: async (): Promise<ResidentWithProfile> => {
      const response = await fetch(`/api/residents/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch resident");
      }
      return response.json();
    },
    enabled: !!id,
  });
}

// Create resident mutation
export function useCreateResident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Resident>) => {
      const response = await fetch("/api/residents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create resident");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["residents"] });
    },
  });
}

// Update resident mutation
export function useUpdateResident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Resident> }) => {
      const response = await fetch(`/api/residents/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update resident");
      }

      return response.json();
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["residents"] });
      queryClient.invalidateQueries({ queryKey: ["residents", id] });
    },
  });
}

// Delete resident mutation
export function useDeleteResident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/residents/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete resident");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["residents"] });
    },
  });
}
