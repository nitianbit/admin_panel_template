import Typography from "@mui/material/Typography"
import Stack from "@mui/material/Stack"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"

export default function HealthCard(props: {
  icon: any
  title: any
  value: any
  color?: string
}) {
  const textColor = props.color || "inherit"

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        p: 3,
      }}
    >
      <Stack direction="column" justifyContent="center" alignItems="center" spacing={2} width="100%">
        <IconButton
          size="large"
          aria-label="icon"
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            color: textColor,
            transition: "transform 0.3s",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              transform: "scale(1.1)",
            },
          }}
        >
          {props.icon}
        </IconButton>

        <Typography
          variant="body1"
          align="center"
          sx={{
            color: textColor,
            fontWeight: 500,
            fontSize: "0.9rem",
            opacity: 0.9,
          }}
        >
          {props.title}
        </Typography>

        <Typography
          component="p"
          align="center"
          variant="h4"
          sx={{
            fontWeight: 700,
            color: textColor,
            fontSize: "1.8rem",
          }}
        >
          {props.value || "0"}
        </Typography>
      </Stack>
    </Box>
  )
}
