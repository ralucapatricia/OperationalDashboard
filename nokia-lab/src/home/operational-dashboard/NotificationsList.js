import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Fragment } from 'react';


export default function NotificationsList({ notifications}) {
    return (
      <Box sx={{ width: '350px', maxHeight: '400px', overflowY: 'auto', padding: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Notifications
        </Typography>
        <List>
          {notifications.length === 0 ? (
            <ListItem>
              <ListItemText primary="Nu există notificări" />
            </ListItem>
          ) : (
            notifications.map((notification, index) => (
              <Fragment key={index}>
                <ListItem alignItems="flex-start">
                  <NotificationImportantIcon sx={{ mr: 2, mt: 0.5 }} color="primary" />
                  <ListItemText
                    primary={notification}
                  />
                </ListItem>
                {index < notifications.length - 1 && <Divider variant="inset" component="li" />}
              </Fragment>
            ))
          )}
        </List>
      </Box>
    );
  }