import {
  type AdminDirectionRawInput,
  type AdminDirectionContentRepository,
  type AdminDirectionRecord,
  validateDirectionContentInput,
} from "../domain/direction-content";

export async function getAdminDirections(
  repository: AdminDirectionContentRepository,
): Promise<AdminDirectionRecord[]> {
  return repository.listDirections();
}

export async function createAdminDirection(
  repository: AdminDirectionContentRepository,
  input: AdminDirectionRawInput,
): Promise<AdminDirectionRecord> {
  return repository.createDirection(validateDirectionContentInput(input));
}

export async function updateAdminDirection(
  repository: AdminDirectionContentRepository,
  directionId: string,
  input: AdminDirectionRawInput,
): Promise<AdminDirectionRecord> {
  return repository.updateDirection(
    validateDirectionContentInput(input, { id: directionId }),
  );
}
