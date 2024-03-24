
export interface CreateRunnerResponse {
	id: string;
	status: "running" | "completed";
}

export interface GetRunnerDetails {
	id: string;

	build_stderr: string | null;
	build_stdout: string | null;
	build_exit_code: number;
	build_result: "success" | "failure" | "error";

	stdout: string | null;
	stderr: string | null;
	result: "success" | "failure" | "error";
	exit_code: number;
}