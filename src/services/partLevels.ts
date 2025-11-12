import { apiPublic } from "./httpClient";

export type PartLevelType = "large" | "medium" | "small";

export interface PartLevelResponse {
    level: PartLevelType;
    parent?: string | { large: string; medium?: string };
    resultData: string[];
}

interface FetchPartLevelsParams {
    large?: string | null;
    medium?: string | null;
}

export const fetchPartLevels = async (params: FetchPartLevelsParams = {}) => {
    const response = await apiPublic.get<PartLevelResponse>("/spc-part-master/levels", {
        params: {
            large: params.large || undefined,
            medium: params.medium || undefined,
        },
    });

    return response.data;
};
