import * as React from "react";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";

export interface PaginatedOption {
    value: string;
    label: string;
}

interface FetchParams {
    page: number;
    limit: number;
    search: string;
}

interface FetchResult {
    options: PaginatedOption[];
    hasMore: boolean;
}

interface Props {
    label: string;
    value?: string;
    onChange: (value: string) => void;
    fetchOptions: (params: FetchParams) => Promise<FetchResult>;
    resetKey?: string | number;
    disabled?: boolean;
    error?: boolean;
    helperText?: string;
    pageSize?: number;
}

const PaginatedSearchDropdown: React.FC<Props> = ({
    label,
    value,
    onChange,
    fetchOptions,
    resetKey,
    disabled = false,
    error = false,
    helperText = "",
    pageSize = 10,
}) => {
    const [options, setOptions] = React.useState<PaginatedOption[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [hasMore, setHasMore] = React.useState(false);
    const [page, setPage] = React.useState(1);
    const [inputValue, setInputValue] = React.useState("");
    const [debouncedSearch, setDebouncedSearch] = React.useState("");
    const requestIdRef = React.useRef(0);
    const selectedLabelRef = React.useRef<Record<string, string>>({});

    const loadOptions = React.useCallback(
        async (nextPage: number, search: string, append: boolean) => {
            const requestId = ++requestIdRef.current;
            setLoading(true);
            try {
                const result = await fetchOptions({
                    page: nextPage,
                    limit: pageSize,
                    search,
                });

                if (requestId !== requestIdRef.current) return;

                setOptions((prev) => {
                    if (!append) return result.options;
                    const seen = new Set(prev.map((item) => item.value));
                    const merged = [...prev];
                    for (const item of result.options) {
                        if (!seen.has(item.value)) merged.push(item);
                    }
                    return merged;
                });
                setHasMore(result.hasMore);
                setPage(nextPage);
            } catch (_error) {
                if (!append) setOptions([]);
                setHasMore(false);
            } finally {
                if (requestId === requestIdRef.current) {
                    setLoading(false);
                }
            }
        },
        [fetchOptions, pageSize]
    );

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(inputValue.trim());
        }, 300);
        return () => clearTimeout(timer);
    }, [inputValue]);

    React.useEffect(() => {
        setOptions([]);
        setPage(1);
        setHasMore(false);
        requestIdRef.current += 1;
        if (!disabled) {
            loadOptions(1, debouncedSearch, false);
        }
    }, [debouncedSearch, resetKey, disabled, loadOptions]);

    const selectedOption =
        options.find((item) => item.value === value) ||
        (value
            ? {
                value,
                label: selectedLabelRef.current[value] || value,
            }
            : null);

    React.useEffect(() => {
        if (selectedOption?.value && selectedOption?.label) {
            selectedLabelRef.current[selectedOption.value] = selectedOption.label;
        }
    }, [selectedOption]);

    React.useEffect(() => {
        if (!value) {
            setInputValue("");
            return;
        }
        if (selectedOption?.label) {
            setInputValue(selectedOption.label);
        }
    }, [value, selectedOption?.label]);

    const handleListScroll = (event: React.SyntheticEvent) => {
        const listboxNode = event.currentTarget as HTMLElement;
        const nearBottom =
            listboxNode.scrollTop + listboxNode.clientHeight >=
            listboxNode.scrollHeight - 30;

        if (nearBottom && hasMore && !loading) {
            loadOptions(page + 1, debouncedSearch, true);
        }
    };

    return (
        <Autocomplete
            options={options}
            value={selectedOption}
            inputValue={inputValue}
            onInputChange={(_event, val, reason) => {
                if (reason === "input") {
                    setInputValue(val);
                }
            }}
            onChange={(_event, option) => {
                const nextValue = option?.value || "";
                const nextLabel = option?.label || "";
                if (nextValue && nextLabel) {
                    selectedLabelRef.current[nextValue] = nextLabel;
                }
                setInputValue(nextLabel);
                onChange(nextValue);
            }}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, selected) => option.value === selected.value}
            loading={loading}
            disabled={disabled}
            ListboxProps={{
                onScroll: handleListScroll,
                style: { maxHeight: 280, overflow: "auto" },
            }}
            noOptionsText={loading ? "Loading..." : "No options"}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    size="small"
                    error={error}
                    helperText={helperText}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {loading ? <CircularProgress color="inherit" size={18} /> : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
        />
    );
};

export default PaginatedSearchDropdown;
